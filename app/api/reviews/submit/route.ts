import { NextRequest, NextResponse } from "next/server";
import { getBearerToken } from "@/app/lib/auth-utils";

const API_BASE = process.env.API_BASE!;
const SYSTEM_KEY = process.env.SYSTEM_KEY!;

export const dynamic = "force-dynamic";

/**
 * POST /api/reviews/submit
 * Submits a product review with rating, comment, and optional images
 * 
 * Headers:
 * - Authorization: Bearer {token} (required)
 * 
 * Body:
 * {
 *   "product_id": number,
 *   "rating": number,
 *   "comment": string,
 *   "images": [{ "image": "base64...", "filename": "..." }]
 * }
 * 
 * Backend: POST /api/v2/reviews/submit
 */
export async function POST(req: NextRequest) {
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

    // Parse request body
    const body = await req.json();

    // Build headers
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
      "System-Key": SYSTEM_KEY,
      Authorization: `Bearer ${bearerToken}`,
    };

    // Call backend API: POST /api/v2/reviews/submit
    const res = await fetch(`${API_BASE}/reviews/submit`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
      cache: "no-cache",
    });

    const json = await res.json();
    return NextResponse.json(json, { status: res.status });
  } catch (error) {
    console.error("Review submission API error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to submit review" },
      { status: 500 }
    );
  }
}
