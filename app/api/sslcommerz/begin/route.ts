
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { getBearerToken } from "@/app/lib/auth-utils";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const combined_order_id = searchParams.get("combined_order_id");
    const user_id = searchParams.get("user_id");

    console.log("SSLCommerz Begin Proxy - Query Params:", { combined_order_id, user_id });

    if (!combined_order_id) {
        return NextResponse.json(
            { result: false, message: "Missing combined_order_id" },
            { status: 400 }
        );
    }

    const API_BASE = process.env.API_BASE;
    const SYSTEM_KEY = process.env.SYSTEM_KEY;

    if (!API_BASE || !SYSTEM_KEY) {
      console.error("Missing API_BASE or SYSTEM_KEY in environment");
      return NextResponse.json(
        { result: false, message: "Server configuration error" },
        { status: 500 }
      );
    }

    // Build query string for backend
    // Route: /api/v2/sslcommerz/begin?combined_order_id=81&payment_type=cart_payment
    const backendQueryParams = new URLSearchParams();
    backendQueryParams.append("combined_order_id", combined_order_id);
    backendQueryParams.append("payment_type", "cart_payment");
    if (user_id) {
        backendQueryParams.append("user_id", user_id);
    }
    
    // Determine backend URL
    // existing countries API uses v2: like.test/api/v2/countries
    // so we assume sslcommerz is also v2 as per user request
    const backendUrl = `${API_BASE}/sslcommerz/begin?${backendQueryParams.toString()}`;

    // Extract Bearer token
    const bearerToken = getBearerToken(req);

    const headers: Record<string, string> = {
      "System-Key": SYSTEM_KEY,
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(bearerToken && { Authorization: `Bearer ${bearerToken}` }),
    };

    console.log("Calling Backend URL:", backendUrl);

    const response = await axios.get(backendUrl, { headers });

    console.log("Backend Response:", response.data);

    return NextResponse.json(response.data);

  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      console.error("Proxy /api/sslcommerz/begin error:", err.message);
      console.error("Full error:", err.response?.data);

      return NextResponse.json(
        {
          result: false,
          message: err.response?.data?.message || err.message,
        },
        { status: err.response?.status || 500 }
      );
    }

    console.error("Unexpected error:", err);

    return NextResponse.json(
      { result: false, message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
