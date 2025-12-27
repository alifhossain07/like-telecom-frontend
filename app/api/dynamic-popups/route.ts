import { NextResponse } from "next/server";
import axios from "axios";

// Proxies external dynamic popups API - fetches from like.test/api/v2/dynamic-popups/
export async function GET() {
  const API_BASE = process.env.API_BASE;
  const SYSTEM_KEY = process.env.SYSTEM_KEY;

  if (!API_BASE || !SYSTEM_KEY) {
    return NextResponse.json(
      { success: false, error: "Server configuration error", data: null },
      { status: 500 }
    );
  }

  // Fetch dynamic popups from like.test/api/v2/dynamic-popups/
  const url = `${API_BASE}/dynamic-popups/`;

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
    console.error("Error fetching dynamic popups from API:", err);
    if (axios.isAxiosError(err)) {
      return NextResponse.json(
        {
          success: false,
          error: err.response?.data?.message || err.message || "Failed to fetch dynamic popups",
          data: null,
        },
        { status: err.response?.status || 500 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Unexpected error fetching dynamic popups", data: null },
      { status: 500 }
    );
  }
}

