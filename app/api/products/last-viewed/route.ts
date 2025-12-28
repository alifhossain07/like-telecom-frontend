import { NextRequest, NextResponse } from "next/server";
import { getBearerToken } from "@/app/lib/auth-utils";

const API_BASE = process.env.API_BASE!;
const SYSTEM_KEY = process.env.SYSTEM_KEY!;

/**
 * GET /api/products/last-viewed
 * Fetches last viewed products for the authenticated user
 * 
 * Headers:
 * - Authorization: Bearer {token} (optional - only for logged-in users)
 * 
 * Backend: GET /api/v2/products/last-viewed
 */
export async function GET(req: NextRequest) {
  try {
    // Extract Bearer token from Authorization header (returns null for guest users)
    const bearerToken = getBearerToken(req);
    
    // Build headers:
    // - System-Key: Always required for API access
    // - Authorization: Only included if bearerToken is available (logged-in users)
    const headers: Record<string, string> = {
      Accept: "application/json",
      "System-Key": SYSTEM_KEY,
      ...(bearerToken && { Authorization: `Bearer ${bearerToken}` }),
    };
    
    // Call backend API: GET /api/v2/products/last-viewed
    const res = await fetch(`${API_BASE}/products/last-viewed`, {
      headers,
      cache: "no-cache",
    });

    const json = await res.json();

    // Return the response data
    // If user is not logged in or no last-viewed products, backend will return empty array
    return NextResponse.json(json, { status: res.status });
  } catch (error) {
    console.error("Last viewed products API error:", error);
    return NextResponse.json(
      { success: false, data: [], message: "Failed to load last viewed products" },
      { status: 500 }
    );
  }
}

