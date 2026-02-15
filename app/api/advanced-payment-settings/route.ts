export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { getBearerToken } from "@/app/lib/auth-utils";

export async function GET(req: NextRequest) {
  try {
    const API_BASE = process.env.API_BASE;
    const SYSTEM_KEY = process.env.SYSTEM_KEY;

    if (!API_BASE || !SYSTEM_KEY) {
      console.error("Missing API_BASE or SYSTEM_KEY in environment");
      return NextResponse.json(
        { result: false, message: "Server configuration error" },
        { status: 500 }
      );
    }

    const backendUrl = `${API_BASE}/advanced-payment-settings`;

    // Extract Bearer token
    const bearerToken = getBearerToken(req);

    const headers: Record<string, string> = {
      "System-Key": SYSTEM_KEY,
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(bearerToken && { Authorization: `Bearer ${bearerToken}` }),
    };

    console.log("Calling Backend URL (Advanced Payment Settings):", backendUrl);

    const response = await axios.get(backendUrl, { headers });

    console.log("Backend Response (Advanced Payment Settings):", response.data);

    return NextResponse.json(response.data);

  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      console.error("Proxy /api/advanced-payment-settings error:", err.message);
      console.error("Full error:", err.response?.data);

      return NextResponse.json(
        {
          result: false,
          message: err.response?.data?.message || err.message,
        },
        { status: err.response?.status || 500 }
      );
    }

    console.error("Unexpected error:", err);

    return NextResponse.json(
      { result: false, message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
