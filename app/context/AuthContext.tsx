"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import type { User } from "./authApi";
import { fetchProfile, login as apiLogin, signup as apiSignup } from "./authApi";

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
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = "like_auth_token";
const SESSION_TIMESTAMP_KEY = "like_auth_token_time";
const SESSION_DURATION_MS = 30 * 60 * 1000; // 30 minutes

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Rehydrate from localStorage on mount
  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    const storedTime = typeof window !== "undefined" ? localStorage.getItem(SESSION_TIMESTAMP_KEY) : null;
    if (!stored || !storedTime) {
      setLoading(false);
      return;
    }

    const now = Date.now();
    const sessionStart = parseInt(storedTime, 10);
    if (isNaN(sessionStart) || now - sessionStart > SESSION_DURATION_MS) {
      // Session expired
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(SESSION_TIMESTAMP_KEY);
      setAccessToken(null);
      setUser(null);
      setLoading(false);
      return;
    }

    setAccessToken(stored);
    fetchProfile(stored)
      .then((res) => {
        if (res.result) {
          setUser(res.user);
        } else {
          localStorage.removeItem(STORAGE_KEY);
          localStorage.removeItem(SESSION_TIMESTAMP_KEY);
          setAccessToken(null);
        }
      })
      .catch(() => {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(SESSION_TIMESTAMP_KEY);
        setAccessToken(null);
      })
      .finally(() => setLoading(false));

    // Set up auto-logout timer
    const timeout = setTimeout(() => {
      logout();
    }, SESSION_DURATION_MS - (now - sessionStart));
    return () => clearTimeout(timeout);
  }, []);


  const handleLogin = async (args: { phone: string; password: string }) => {
    setLoading(true);
    try {
      const res = await apiLogin(args);
      if (!res.result) throw new Error(res.message || "Login failed");
      setAccessToken(res.access_token);
      setUser(res.user);
      localStorage.setItem(STORAGE_KEY, res.access_token);
      localStorage.setItem(SESSION_TIMESTAMP_KEY, Date.now().toString());
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
      setAccessToken(res.access_token);
      setUser(res.user);
      localStorage.setItem(STORAGE_KEY, res.access_token);
      localStorage.setItem(SESSION_TIMESTAMP_KEY, Date.now().toString());
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(SESSION_TIMESTAMP_KEY);
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