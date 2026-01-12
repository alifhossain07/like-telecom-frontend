import { NextResponse } from "next/server";
import axios from "axios";
import { getBearerToken } from "@/app/lib/auth-utils";
import { NextRequest } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const API_BASE = process.env.API_BASE;
  const SYSTEM_KEY = process.env.SYSTEM_KEY;

  if (!API_BASE || !SYSTEM_KEY) {
    return NextResponse.json(
      { success: false, message: "Server configuration error" },
      { status: 500 }
    );
  }

  const bearerToken = getBearerToken(req);
  
  // Note: The coupon list API might expect an authenticated user, so we pass the token if available.
  // If no token, the API might return public coupons or an empty list/error depending on backend logic.
  
  const headers: Record<string, string> = {
    "System-Key": SYSTEM_KEY,
    "Apply-Content": "application/json",
    "Accept": "application/json",
  };

  if (bearerToken) {
    headers["Authorization"] = `Bearer ${bearerToken}`;
  }

  const url = `${API_BASE}/coupon-list`;

  try {
    const response = await axios.get(url, { headers });
    return NextResponse.json(response.data, { status: 200 });
  } catch (err: unknown) {
    console.error("Error fetching coupons:", err);
    let message = "Failed to fetch coupons";
    let status = 500;

    if (axios.isAxiosError(err)) {
        message = err.response?.data?.message || err.message;
        status = err.response?.status || 500;
    }

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status }
    );
  }
}
