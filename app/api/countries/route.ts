import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

// Proxies external countries API (districts) - fetches from like.test/api/v2/countries
export async function GET(req: NextRequest) {
  const API_BASE = process.env.API_BASE;
  const SYSTEM_KEY = process.env.SYSTEM_KEY;

  if (!API_BASE || !SYSTEM_KEY) {
    return NextResponse.json(
      { success: false, message: "Server configuration error" },
      { status: 500 }
    );
  }

  // Fetch districts from like.test/api/v2/countries
  const url = `${API_BASE}/countries`;

  try {
    const response = await axios.get(url, {
      headers: {
        "System-Key": SYSTEM_KEY,
        "Cache-Control": "no-store",
        Accept: "application/json",
      },
    });

    // Return the response data as-is (should contain {data: [...], success: true, status: 200})
    // This ensures all districts are returned
    const responseData = response.data;
    
    // Ensure we return the data in the expected format
    if (responseData && Array.isArray(responseData.data)) {
      return NextResponse.json(responseData, { status: 200 });
    }
    
    // Fallback: if response structure is different, try to extract data
    return NextResponse.json(responseData, { status: 200 });
  } catch (err: unknown) {
    console.error("Error fetching districts from API:", err);
    if (axios.isAxiosError(err)) {
      return NextResponse.json(
        {
          success: false,
          message: err.response?.data?.message || err.message || "Failed to fetch districts",
          data: [],
        },
        { status: err.response?.status || 500 }
      );
    }
    return NextResponse.json(
      { success: false, message: "Unexpected error fetching districts", data: [] },
      { status: 500 }
    );
  }
}

