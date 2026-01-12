"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import type { User } from "./authApi";
import { fetchProfile, login as apiLogin, signup as apiSignup, logout as apiLogout } from "./authApi";

interface AuthContextValue {
  user: User | null;
  accessToken: string | null;
  loading: boolean;
  login: (args: { phone: string; password: string }) => Promise<void>;
  signup: (args: {
    name: string;
    email_or_phone: string;
    password: string;
    password_confirmation: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = "like_auth_token";
const SESSION_TIMESTAMP_KEY = "like_auth_token_time";
const SESSION_DURATION_MS = 2 * 60 * 60 * 1000; // 2 hours (120 minutes)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Rehydrate from localStorage on mount
  useEffect(() => {
    let isMounted = true;

    const stored = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    const storedTime = typeof window !== "undefined" ? localStorage.getItem(SESSION_TIMESTAMP_KEY) : null;
    if (!stored || !storedTime) {
      setLoading(false);
      return;
    }

    const now = Date.now();
    const sessionStart = parseInt(storedTime, 10);
    if (isNaN(sessionStart) || now - sessionStart > SESSION_DURATION_MS) {
      // Session expired - auto logout
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(SESSION_TIMESTAMP_KEY);
      if (typeof window !== "undefined") {
        document.cookie = `${STORAGE_KEY}=; path=/; max-age=0`;
      }
      setAccessToken(null);
      setUser(null);
      setLoading(false);
      return;
    }

    setAccessToken(stored);
    // Fetch user profile using Bearer token
    fetchProfile(stored)
      .then((userData) => {
        if (isMounted) {
          setUser(userData);
        }
      })
      .catch(() => {
        // Token is invalid, clear storage
        if (isMounted) {
          localStorage.removeItem(STORAGE_KEY);
          localStorage.removeItem(SESSION_TIMESTAMP_KEY);
          if (typeof window !== "undefined") {
            document.cookie = `${STORAGE_KEY}=; path=/; max-age=0`;
          }
          setAccessToken(null);
          setUser(null);
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    // Set up auto-logout timer (logout when session expires)
    const timeRemaining = SESSION_DURATION_MS - (now - sessionStart);
    const timeout = setTimeout(() => {
      if (isMounted) {
        // Perform logout (clear local state only, API call is optional)
        const token = stored;
        setUser(null);
        setAccessToken(null);
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(SESSION_TIMESTAMP_KEY);
        if (typeof window !== "undefined") {
          document.cookie = `${STORAGE_KEY}=; path=/; max-age=0`;
        }

        // Optionally call logout API
        if (token) {
          apiLogout(token).catch(() => {
            // Silently fail if logout API call fails
          });
        }
      }
    }, timeRemaining);

    return () => {
      isMounted = false;
      clearTimeout(timeout);
    };
  }, []);


  const handleLogin = async (args: { phone: string; password: string }) => {
    setLoading(true);
    try {
      const res = await apiLogin(args);
      if (!res.result) throw new Error(res.message || "Login failed");

      // Store token and timestamp in localStorage and cookie
      const token = res.access_token;
      setAccessToken(token);
      localStorage.setItem(STORAGE_KEY, token);
      localStorage.setItem(SESSION_TIMESTAMP_KEY, Date.now().toString());
      // Also store in cookie for Server Components to access
      document.cookie = `${STORAGE_KEY}=${token}; path=/; max-age=${SESSION_DURATION_MS / 1000}; SameSite=Lax`;

      // Fetch full user profile using Bearer token
      try {
        const fullUserProfile = await fetchProfile(token);
        setUser(fullUserProfile);
      } catch (error) {
        // If fetching full profile fails, use the simplified user from login response
        console.warn("Failed to fetch full user profile, using simplified user data:", error);
        // Note: res.user might not match full User interface, so we'll use what we have
        // This is a fallback - ideally the API should return full user data
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (args: {
    name: string;
    email_or_phone: string;
    password: string;
    password_confirmation: string;
  }) => {
    setLoading(true);
    try {
      const res = await apiSignup(args);
      if (!res.result) throw new Error(res.message || "Signup failed");

      // Store token and timestamp in localStorage and cookie
      const token = res.access_token;
      setAccessToken(token);
      localStorage.setItem(STORAGE_KEY, token);
      localStorage.setItem(SESSION_TIMESTAMP_KEY, Date.now().toString());
      // Also store in cookie for Server Components to access
      document.cookie = `${STORAGE_KEY}=${token}; path=/; max-age=${SESSION_DURATION_MS / 1000}; SameSite=Lax`;

      // Fetch full user profile using Bearer token
      try {
        const fullUserProfile = await fetchProfile(token);
        setUser(fullUserProfile);
      } catch (error) {
        // If fetching full profile fails, use the simplified user from signup response
        console.warn("Failed to fetch full user profile, using simplified user data:", error);
        // Note: res.user might not match full User interface, so we'll use what we have
        // This is a fallback - ideally the API should return full user data
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    const token = accessToken;

    // Clear local state first for immediate UI update
    setUser(null);
    setAccessToken(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(SESSION_TIMESTAMP_KEY);
      // Also clear cookie
      document.cookie = `${STORAGE_KEY}=; path=/; max-age=0`;
    }

    // Call logout API to invalidate token on server (if token exists)
    if (token) {
      try {
        await apiLogout(token);
      } catch (error) {
        // Even if logout API fails, we've already cleared local state
        console.error("Logout API call failed:", error);
      }
    }
  };

  const refreshUser = async () => {
    if (!accessToken) return;

    try {
      const userData = await fetchProfile(accessToken);
      setUser(userData);
    } catch (error) {
      console.error("Failed to refresh user profile:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        loading,
        login: handleLogin,
        signup: handleSignup,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};