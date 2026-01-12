import { NextRequest, NextResponse } from "next/server";
import { getBearerToken } from "@/app/lib/auth-utils";

const API_BASE = process.env.API_BASE!;
const SYSTEM_KEY = process.env.SYSTEM_KEY!;

export const dynamic = "force-dynamic";

/**
 * GET /api/reviews/pending
 * Fetches products that are pending review (from delivered orders)
 * 
 * Headers:
 * - Authorization: Bearer {token} (required)
 * 
 * Backend: GET /api/v2/reviews/pending
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

    // Build headers
    const headers: Record<string, string> = {
      Accept: "application/json",
      "System-Key": SYSTEM_KEY,
      Authorization: `Bearer ${bearerToken}`,
    };

    // Call backend API: GET /api/v2/reviews/pending
    const res = await fetch(`${API_BASE}/reviews/pending`, {
      headers,
      cache: "no-cache",
    });

    const json = await res.json();
    return NextResponse.json(json, { status: res.status });
  } catch (error) {
    console.error("Pending reviews API error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to load pending reviews" },
      { status: 500 }
    );
  }
}
