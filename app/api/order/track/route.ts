import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const order_code = searchParams.get("order_code");

    if (!order_code) {
      return NextResponse.json(
        { success: false, message: "Order code is required" },
        { status: 400 }
      );
    }

    const API_BASE = process.env.API_BASE;
    const SYSTEM_KEY = process.env.SYSTEM_KEY;

    if (!API_BASE || !SYSTEM_KEY) {
      console.error("Missing API_BASE or SYSTEM_KEY in environment");
      return NextResponse.json(
        { success: false, message: "Server configuration error" },
        { status: 500 }
      );
    }

    const url = `${API_BASE}/order/track`;

    // Forwarding GET request with body to backend (Axios allows this)
    const response = await axios.get(
      url,
      {
        data: { order_code },
        headers: {
          "System-Key": SYSTEM_KEY,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      console.error("Proxy /api/order/track error:", err.message);
      return NextResponse.json(
        {
          success: false,
          message: err.response?.data?.message || err.message,
        },
        { status: err.response?.status || 500 }
      );
    }

    console.error("Unexpected error in /api/order/track:", err);
    return NextResponse.json(
      { success: false, message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
