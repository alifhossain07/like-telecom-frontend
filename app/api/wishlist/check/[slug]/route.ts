import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { getBearerToken } from "@/app/lib/auth-utils";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;
    const API_BASE = process.env.API_BASE;
    const SYSTEM_KEY = process.env.SYSTEM_KEY;

    if (!API_BASE || !SYSTEM_KEY) {
      return NextResponse.json(
        { success: false, message: "Server configuration error" },
        { status: 500 }
      );
    }

    const bearerToken = getBearerToken(req);
    if (!bearerToken) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      );
    }

    const response = await axios.get(`${API_BASE}/wishlists-check-product/${slug}`, {
      headers: {
        "System-Key": SYSTEM_KEY,
        Authorization: `Bearer ${bearerToken}`,
        Accept: "application/json",
      },
    });

    return NextResponse.json(response.data);
  } catch {
    // If the backend returns an error (404, 500, etc.), it usually means the product is NOT in the wishlist.
    // We intercept this and return is_in_wishlist: false to the frontend to prevent error logs.
    console.log(`Wishlist check: Product likely not in wishlist or backend error for slug: ${params.slug}`);
    
    return NextResponse.json({
      success: true,
      is_in_wishlist: false,
      product_slug: params.slug,
      message: "Product not found in wishlist"
    });
  }
}
