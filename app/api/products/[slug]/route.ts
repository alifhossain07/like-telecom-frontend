import { NextRequest, NextResponse } from "next/server";
import { getBearerToken } from "@/app/lib/auth-utils";

const API_BASE = process.env.API_BASE!;
const SYSTEM_KEY = process.env.SYSTEM_KEY!;

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    // Extract Bearer token from Authorization header (returns null for guest users)
    const bearerToken = getBearerToken(req);
    
    // Debug logging
    console.log("Product API Route - Bearer Token:", bearerToken ? "Present" : "Not present");
    console.log("Product API Route - Request Headers:", Object.fromEntries(req.headers.entries()));

    // Build headers:
    // - System-Key: Always required for API access
    // - Authorization: Only included if bearerToken is available (logged-in users)
    //   When present, backend automatically records product view in last_viewed_products table
    //   Guest users can still view products without Authorization header
    const headers: Record<string, string> = {
      Accept: "application/json",
      "System-Key": SYSTEM_KEY,
      ...(bearerToken && { Authorization: `Bearer ${bearerToken}` }),
    };
    
    console.log("Product API Route - Headers being sent to backend:", {
      "System-Key": SYSTEM_KEY ? "Present" : "Missing",
      "Authorization": bearerToken ? "Present" : "Not present"
    });

    const res = await fetch(`${API_BASE}/products/${slug}`, {
      headers,
      cache: "no-cache",
    });

    const json = await res.json();

    if (!json.success || !json.data || json.data.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Return the full data object
    return NextResponse.json(json.data[0]);
  } catch (error) {
    console.error("Product API error:", error);
    return NextResponse.json(
      { error: "Failed to load product" },
      { status: 500 }
    );
  }
}
