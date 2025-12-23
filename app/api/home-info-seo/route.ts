import { NextResponse } from "next/server";

// Get API base URL and System Key from environment variables
const API_BASE = process.env.API_BASE!;
const SYSTEM_KEY = process.env.SYSTEM_KEY!;

export async function GET() {
  try {
    const res = await fetch(`${API_BASE}/home-bottom-info`, {
      headers: {
        Accept: "application/json",
        "System-Key": SYSTEM_KEY,
      },
      cache: "no-store",
    });

    const seoJson = await res.json();

    if (seoJson?.data?.[0]) {
      return NextResponse.json({
        success: true,
        data: seoJson.data[0],
      });
    }

    return NextResponse.json(
      { success: false, error: "Failed to load home bottom info data" },
      { status: 500 }
    );
  } catch (error) {
    console.error("Home Bottom INFO API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load home bottom info data" },
      { status: 500 }
    );
  }
}