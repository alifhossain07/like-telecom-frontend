import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

// Proxies external states-by-country API (upazilas/states for a given district)
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get("name");
  const countryId = params.id;

  const API_BASE = process.env.API_BASE;
  const SYSTEM_KEY = process.env.SYSTEM_KEY;

  if (!API_BASE || !SYSTEM_KEY) {
    return NextResponse.json(
      { success: false, message: "Server configuration error" },
      { status: 500 }
    );
  }

  const url = name
    ? `${API_BASE}/states-by-country/${countryId}?name=${encodeURIComponent(name)}`
    : `${API_BASE}/states-by-country/${countryId}`;

  try {
    const response = await axios.get(url, {
      headers: {
        "System-Key": SYSTEM_KEY,
        "Cache-Control": "no-store",
      },
    });
    return NextResponse.json(response.data, { status: 200 });
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      return NextResponse.json(
        {
          success: false,
          message: err.response?.data?.message || err.message || "Failed to fetch states",
        },
        { status: err.response?.status || 500 }
      );
    }
    return NextResponse.json(
      { success: false, message: "Unexpected error fetching states" },
      { status: 500 }
    );
  }
}

