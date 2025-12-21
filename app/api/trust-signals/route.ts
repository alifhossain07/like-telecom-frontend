import { NextResponse } from "next/server";

const API_BASE = process.env.API_BASE!;
const SYSTEM_KEY = process.env.SYSTEM_KEY!;

export async function GET() {
  try {
    const res = await fetch(`${API_BASE}/trust-signals`, {
      headers: {
        Accept: "application/json",
        "System-Key": SYSTEM_KEY,
      },
      cache: "no-store",
    });

    const json = await res.json();

    return NextResponse.json({
      success: true,
      data: json?.data ?? [],
    });

  } catch (error) {
    console.error("Trust Signals API error:", error);

    return NextResponse.json(
      { success: false, error: "Failed to load trust signals" },
      { status: 500 }
    );
  }
}
