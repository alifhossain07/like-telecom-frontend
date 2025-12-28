import { NextRequest, NextResponse } from "next/server";
import { getBearerToken } from "@/app/lib/auth-utils";

/**
 * GET /api/shipping/address
 * Gets all shipping addresses for the logged-in user
 * 
 * Headers:
 * - Authorization: Bearer {token} (required)
 * 
 * Backend: GET /api/v2/user/shipping/address
 */
export async function GET(req: NextRequest) {
  try {
    const apiBase = process.env.API_BASE;
    const systemKey = process.env.SYSTEM_KEY;

    if (!apiBase || !systemKey) {
      return NextResponse.json(
        { success: false, message: "API_BASE or SYSTEM_KEY not configured" },
        { status: 500 }
      );
    }

    // Extract Bearer token from Authorization header
    const bearerToken = getBearerToken(req);
    if (!bearerToken) {
      return NextResponse.json(
        { success: false, message: "Authorization token required" },
        { status: 401 }
      );
    }

    // Call backend API
    const res = await fetch(`${apiBase}/user/shipping/address`, {
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
        { success: false, message: "Backend API returned an error. Please check the server logs." },
        { status: 500 }
      );
    }

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Shipping address fetch error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch shipping addresses" },
      { status: 500 }
    );
  }
}
