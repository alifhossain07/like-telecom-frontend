import { NextRequest, NextResponse } from "next/server";
import { getBearerToken } from "@/app/lib/auth-utils";

/**
 * GET /api/auth/info
 * Fetches user information using Bearer token authentication
 * 
 * Headers:
 * - Authorization: Bearer {token} (required)
 * 
 * Backend: GET /api/v2/auth/user
 */
export async function GET(req: NextRequest) {
  try {
    const apiBase = process.env.API_BASE;
    const systemKey = process.env.SYSTEM_KEY;

    if (!apiBase || !systemKey) {
      return NextResponse.json(
        { result: false, message: "API_BASE or SYSTEM_KEY not configured" },
        { status: 500 }
      );
    }

    // Extract Bearer token from Authorization header
    const bearerToken = getBearerToken(req);
    if (!bearerToken) {
      return NextResponse.json(
        { result: false, message: "Authorization token required" },
        { status: 401 }
      );
    }

    // Call backend API: GET /api/v2/auth/user
    const res = await fetch(`${apiBase}/auth/user`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "System-Key": systemKey,
        "Authorization": `Bearer ${bearerToken}`,
        "Accept": "application/json",
      },
    });

    // Check if response is JSON
    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await res.text();
      console.error("Non-JSON response from backend:", text.substring(0, 500));
      return NextResponse.json(
        { result: false, message: "Backend API returned an error. Please check the server logs." },
        { status: 500 }
      );
    }

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (e) {
    console.error("Profile proxy error:", e);
    return NextResponse.json(
      { result: false, message: "Fetching profile failed" },
      { status: 500 }
    );
  }
}