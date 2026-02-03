import { NextResponse } from "next/server";
import axios from "axios";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const API_BASE = process.env.API_BASE;
    const SYSTEM_KEY = process.env.SYSTEM_KEY;

    if (!API_BASE || !SYSTEM_KEY) {
      return NextResponse.json(
        { success: false, message: "Server configuration error" },
        { status: 500 }
      );
    }

    const response = await axios.get(`${API_BASE}/payment-types`, {
      headers: {
        "System-Key": SYSTEM_KEY,
        Accept: "application/json",
      },
    });

    return NextResponse.json(response.data);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error fetching payment types:", errorMessage);
    return NextResponse.json(
      { success: false, message: errorMessage || "Failed to fetch payment types" },
      { status: 500 }
    );
  }
}
