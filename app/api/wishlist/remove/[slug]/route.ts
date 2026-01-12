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

    const response = await axios.get(`${API_BASE}/wishlists-remove-product/${slug}`, {
      headers: {
        "System-Key": SYSTEM_KEY,
        Authorization: `Bearer ${bearerToken}`,
        Accept: "application/json",
      },
    });

    return NextResponse.json(response.data);
  } catch (err: unknown) {
    console.error("Proxy /api/wishlist/remove error:", err);
    let message = "An error occurred";
    let status = 500;

    if (axios.isAxiosError(err)) {
        message = err.response?.data?.message || err.message;
        status = err.response?.status || 500;
    } else if (err instanceof Error) {
        message = err.message;
    }

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status }
    );
  }
}
