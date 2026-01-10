
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";


export const dynamic = 'force-dynamic';// Proxies external pages API - fetches from like.test/api/v2/pages/{slug}
export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const API_BASE = process.env.API_BASE;
  const SYSTEM_KEY = process.env.SYSTEM_KEY;

  if (!API_BASE || !SYSTEM_KEY) {
    return NextResponse.json(
      { result: false, message: "Server configuration error", data: null },
      { status: 500 }
    );
  }

  const { slug } = params;

  // Fetch page data from like.test/api/v2/pages/{slug}
  const url = `${API_BASE}/pages/${slug}`;

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
    console.error("Error fetching page data from API:", err);
    if (axios.isAxiosError(err)) {
      return NextResponse.json(
        {
          result: false,
          message: err.response?.data?.message || err.message || "Failed to fetch page data",
          data: null,
        },
        { status: err.response?.status || 500 }
      );
    }
    return NextResponse.json(
      { result: false, message: "Unexpected error fetching page data", data: null },
      { status: 500 }
    );
  }
}

