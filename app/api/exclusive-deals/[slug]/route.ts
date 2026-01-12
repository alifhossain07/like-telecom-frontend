import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export const dynamic = 'force-dynamic';

export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const API_BASE = process.env.API_BASE;
  const SYSTEM_KEY = process.env.SYSTEM_KEY;

  if (!API_BASE || !SYSTEM_KEY) {
    return NextResponse.json(
      { success: false, message: "Server configuration error" },
      { status: 500 }
    );
  }

  const { slug } = params;
  const url = `${API_BASE}/exclusive-deals/${slug}`;

  try {
    const response = await axios.get(url, {
      headers: {
        "System-Key": SYSTEM_KEY,
        "Cache-Control": "no-store",
        Accept: "application/json",
      },
    });

    return NextResponse.json(response.data, { status: 200 });
  } catch (err: unknown) {
    console.error(`Error fetching exclusive deal details for ${slug}:`, err);
    let message = `Failed to fetch exclusive deal details for ${slug}`;
    let status = 500;

    if (axios.isAxiosError(err)) {
        message = err.response?.data?.message || err.message;
        status = err.response?.status || 500;
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
