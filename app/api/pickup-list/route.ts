import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

// Proxies external pickup-list API - fetches from like.test/api/v2/pickup-list
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(_req: NextRequest) {
  const API_BASE = process.env.API_BASE;
  const SYSTEM_KEY = process.env.SYSTEM_KEY;

  if (!API_BASE || !SYSTEM_KEY) {
    return NextResponse.json(
      { success: false, message: "Server configuration error" },
      { status: 500 }
    );
  }

  // Fetch pickup stores from like.test/api/v2/pickup-list
  const url = `${API_BASE}/pickup-list`;

  try {
    const response = await axios.get(url, {
      headers: {
        "System-Key": SYSTEM_KEY,
        "Cache-Control": "no-store",
        Accept: "application/json",
      },
    });

    // Return the response data as-is (should contain {data: [...], success: true, status: 200})
    const responseData = response.data;
    
    // Ensure we return the data in the expected format
    if (responseData && Array.isArray(responseData.data)) {
      return NextResponse.json(responseData, { status: 200 });
    }
    
    // Fallback: if response structure is different, try to extract data
    return NextResponse.json(responseData, { status: 200 });
  } catch (err: unknown) {
    console.error("Error fetching pickup stores from API:", err);
    if (axios.isAxiosError(err)) {
      return NextResponse.json(
        {
          success: false,
          message: err.response?.data?.message || err.message || "Failed to fetch pickup stores",
          data: [],
        },
        { status: err.response?.status || 500 }
      );
    }
    return NextResponse.json(
      { success: false, message: "Unexpected error fetching pickup stores", data: [] },
      { status: 500 }
    );
  }
}

