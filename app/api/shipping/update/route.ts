import { NextRequest, NextResponse } from "next/server";
import { getBearerToken } from "@/app/lib/auth-utils";

/**
 * POST /api/shipping/update
 * Updates an existing shipping address
 * 
 * Headers:
 * - Authorization: Bearer {token} (required)
 * 
 * Body:
 * - id: number (address ID)
 * - address: string
 * - country_id: number
 * - state_id: number
 * - phone: string
 * 
 * Backend: POST /api/v2/user/shipping/update
 */
export async function POST(req: NextRequest) {
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

    const body = await req.json();
    const { id, address, country_id, state_id, phone } = body;

    // Validate required fields
    if (!id || !address || !country_id || !state_id || !phone) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Call backend API
    const res = await fetch(`${apiBase}/user/shipping/update`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "System-Key": systemKey,
        "Authorization": `Bearer ${bearerToken}`,
        "Accept": "application/json",
      },
      body: JSON.stringify({
        id,
        address,
        country_id,
        state_id,
        phone,
      }),
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
    console.error("Shipping update error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update shipping address" },
      { status: 500 }
    );
  }
}
