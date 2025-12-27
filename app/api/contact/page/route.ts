import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

// Proxies external contact/page API - fetches from like.test/api/v2/contact/page
export async function GET(req: NextRequest) {
  const API_BASE = process.env.API_BASE;
  const SYSTEM_KEY = process.env.SYSTEM_KEY;

  if (!API_BASE || !SYSTEM_KEY) {
    return NextResponse.json(
      { success: false, message: "Server configuration error" },
      { status: 500 }
    );
  }

  // Fetch contact page data from like.test/api/v2/contact/page
  const url = `${API_BASE}/contact/page`;

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
    console.error("Error fetching contact page data from API:", err);
    if (axios.isAxiosError(err)) {
      return NextResponse.json(
        {
          result: false,
          message: err.response?.data?.message || err.message || "Failed to fetch contact page data",
          data: null,
        },
        { status: err.response?.status || 500 }
      );
    }
    return NextResponse.json(
      { result: false, message: "Unexpected error fetching contact page data", data: null },
      { status: 500 }
    );
  }
}
