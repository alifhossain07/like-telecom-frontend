import { NextRequest, NextResponse } from "next/server";
import { getBearerToken } from "@/app/lib/auth-utils";

/**
 * GET /api/shipping/delete/[id]
 * Deletes a shipping address
 * 
 * Headers:
 * - Authorization: Bearer {token} (required)
 * 
 * Params:
 * - id: number (address ID)
 * 
 * Backend: GET /api/v2/user/shipping/delete/{id}
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const addressId = params.id;

    if (!addressId) {
      return NextResponse.json(
        { success: false, message: "Address ID is required" },
        { status: 400 }
      );
    }

    // Call backend API
    const res = await fetch(`${apiBase}/user/shipping/delete/${addressId}`, {
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
    console.error("Shipping delete error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete shipping address" },
      { status: 500 }
    );
  }
}
