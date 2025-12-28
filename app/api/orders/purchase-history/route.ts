import { NextRequest, NextResponse } from "next/server";
import { getBearerToken } from "@/app/lib/auth-utils";

const API_BASE = process.env.API_BASE!;
const SYSTEM_KEY = process.env.SYSTEM_KEY!;

/**
 * GET /api/orders/purchase-history
 * Fetches purchase history for the authenticated user
 * 
 * Headers:
 * - Authorization: Bearer {token} (required)
 * 
 * Backend: GET /api/v2/purchase-history
 */
export async function GET(req: NextRequest) {
  try {
    if (!API_BASE || !SYSTEM_KEY) {
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

    // Get query parameters for pagination
    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page") || "1";

    // Build headers
    const headers: Record<string, string> = {
      Accept: "application/json",
      "System-Key": SYSTEM_KEY,
      Authorization: `Bearer ${bearerToken}`,
    };

    // Call backend API: GET /api/v2/purchase-history
    const res = await fetch(`${API_BASE}/purchase-history?page=${page}`, {
      headers,
      cache: "no-cache",
    });

    const json = await res.json();
    return NextResponse.json(json, { status: res.status });
  } catch (error) {
    console.error("Purchase history API error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to load purchase history" },
      { status: 500 }
    );
  }
}

