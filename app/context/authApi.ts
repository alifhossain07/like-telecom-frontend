export interface User {
  id: number;
  referred_by: number | null;
  provider: string | null;
  provider_id: string | null;
  refresh_token: string | null;
  access_token: string | null;
  user_type: string;
  name: string;
  email: string | null;
  email_verified_at: string | null;
  verification_code: string | null;
  otp_code: string | null;
  otp_sent_time: string | null;
  new_email_verificiation_code: string | null;
  device_token: string | null;
  avatar: string | null;
  avatar_original: string | null;
  address: string | null;
  country: string | null;
  state: string | null;
  city: string | null;
  postal_code: string | null;
  phone: string;
  balance: number;
  banned: number;
  is_suspicious: number;
  referral_code: string | null;
  customer_package_id: number | null;
  remaining_uploads: number;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  result: boolean;
  message: string;
  access_token: string;
  token_type: string;
  expires_at: string | null;
  user: User;
}

export interface LogoutResponse {
  result: boolean;
  message: string;
}

export interface UserInfoResponse {
  result?: boolean;
  message?: string;
  id: number;
  referred_by: number | null;
  provider: string | null;
  provider_id: string | null;
  refresh_token: string | null;
  access_token: string | null;
  user_type: string;
  name: string;
  email: string | null;
  email_verified_at: string | null;
  verification_code: string | null;
  otp_code: string | null;
  otp_sent_time: string | null;
  new_email_verificiation_code: string | null;
  device_token: string | null;
  avatar: string | null;
  avatar_original: string | null;
  address: string | null;
  country: string | null;
  state: string | null;
  city: string | null;
  postal_code: string | null;
  phone: string;
  balance: number;
  banned: number;
  is_suspicious: number;
  referral_code: string | null;
  customer_package_id: number | null;
  remaining_uploads: number;
  created_at: string;
  updated_at: string;
}

export async function signup(payload: {
  name: string;
  email_or_phone: string;
  password: string;
  password_confirmation: string;
}): Promise<AuthResponse> {
  const res = await fetch("/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: payload.name,
      register_by: "phone",
      email_or_phone: payload.email_or_phone,
      password: payload.password,
      password_confirmation: payload.password_confirmation,
    }),
  });
  if (!res.ok) throw new Error("Signup failed");
  return res.json();
}

export async function login(payload: {
  phone: string;
  password: string;
}): Promise<AuthResponse> {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      login_by: "phone",
      phone: payload.phone,
      password: payload.password,
    }),
  });
  if (!res.ok) throw new Error("Login failed");
  return res.json();
}

/**
 * Fetches user profile information using Bearer token authentication
 * @param access_token - The Bearer token for authentication
 * @returns User information response
 */
export async function fetchProfile(access_token: string): Promise<User> {
  const res = await fetch("/api/auth/info", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${access_token}`,
    },
  });
  
  if (!res.ok) {
    // For 401, token is invalid/expired
    if (res.status === 401) {
      throw new Error("Unauthorized - Invalid or expired token");
    }
    // Try to get error message from response
    try {
      const errorData = await res.json();
      throw new Error(errorData.message || "Fetching profile failed");
    } catch {
      throw new Error(`Fetching profile failed: ${res.status} ${res.statusText}`);
    }
  }
  
  const data: UserInfoResponse = await res.json();
  
  // Validate that we have the required data
  if (!data || !data.id) {
    throw new Error("Invalid user data received");
  }
  
  // Map the response to User interface
  return {
    id: data.id,
    referred_by: data.referred_by,
    provider: data.provider,
    provider_id: data.provider_id,
    refresh_token: data.refresh_token,
    access_token: data.access_token,
    user_type: data.user_type,
    name: data.name,
    email: data.email,
    email_verified_at: data.email_verified_at,
    verification_code: data.verification_code,
    otp_code: data.otp_code,
    otp_sent_time: data.otp_sent_time,
    new_email_verificiation_code: data.new_email_verificiation_code,
    device_token: data.device_token,
    avatar: data.avatar,
    avatar_original: data.avatar_original,
    address: data.address,
    country: data.country,
    state: data.state,
    city: data.city,
    postal_code: data.postal_code,
    phone: data.phone,
    balance: data.balance,
    banned: data.banned,
    is_suspicious: data.is_suspicious,
    referral_code: data.referral_code,
    customer_package_id: data.customer_package_id,
    remaining_uploads: data.remaining_uploads,
    created_at: data.created_at,
    updated_at: data.updated_at,
  };
}

/**
 * Logs out the user by invalidating the Bearer token on the server
 * @param access_token - The Bearer token to invalidate
 * @returns Logout response
 */
export async function logout(access_token: string): Promise<LogoutResponse> {
  const res = await fetch("/api/auth/logout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${access_token}`,
    },
  });
  if (!res.ok) {
    throw new Error("Logout failed");
  }
  return res.json();
}