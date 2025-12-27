import { NextResponse } from "next/server";
import axios from "axios";

// Proxies external bank account details API - fetches from like.test/api/v2/pages/bank-account-details
export async function GET() {
  const API_BASE = process.env.API_BASE;
  const SYSTEM_KEY = process.env.SYSTEM_KEY;

  if (!API_BASE || !SYSTEM_KEY) {
    return NextResponse.json(
      { result: false, message: "Server configuration error", data: null },
      { status: 500 }
    );
  }

  // Fetch bank account details from like.test/api/v2/pages/bank-account-details
  const url = `${API_BASE}/pages/bank-account-details`;

  try {
    const response = await axios.get(url, {
      headers: {
        "System-Key": SYSTEM_KEY,
        "Cache-Control": "no-store",
        Accept: "application/json",
      },
    });

    // Return the response data as-is
    const responseData = response.data;
    
    return NextResponse.json(responseData, { status: 200 });
  } catch (err: unknown) {
    console.error("Error fetching bank account details from API:", err);
    if (axios.isAxiosError(err)) {
      return NextResponse.json(
        {
          result: false,
          message: err.response?.data?.message || err.message || "Failed to fetch bank account details",
          data: null,
        },
        { status: err.response?.status || 500 }
      );
    }
    return NextResponse.json(
      { result: false, message: "Unexpected error fetching bank account details", data: null },
      { status: 500 }
    );
  }
}

