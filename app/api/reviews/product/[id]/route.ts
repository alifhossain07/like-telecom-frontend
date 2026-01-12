import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.API_BASE!;
const SYSTEM_KEY = process.env.SYSTEM_KEY!;

export const dynamic = "force-dynamic";

/**
 * GET /api/reviews/product/[id]
 * Fetches reviews for a specific product
 * 
 * Query params:
 * - page: number (optional, default: 1)
 * 
 * Backend: GET /api/v2/reviews/product/{id}
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!API_BASE || !SYSTEM_KEY) {
      return NextResponse.json(
        { success: false, message: "API_BASE or SYSTEM_KEY not configured" },
        { status: 500 }
      );
    }

    const { id } = params;

    // Get query parameters for pagination
    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page") || "1";

    // Build headers
    const headers: Record<string, string> = {
      Accept: "application/json",
      "System-Key": SYSTEM_KEY,
    };

    // Call backend API: GET /api/v2/reviews/product/{id}
    const res = await fetch(`${API_BASE}/reviews/product/${id}?page=${page}`, {
      headers,
      cache: "no-cache",
    });

    const json = await res.json();
    return NextResponse.json(json, { status: res.status });
  } catch (error) {
    console.error("Product reviews API error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to load product reviews" },
      { status: 500 }
    );
  }
}
