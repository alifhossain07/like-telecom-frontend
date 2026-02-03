import { NextResponse } from "next/server";
import axios from "axios";

export const forceDynamic = true;

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
  } catch (error: any) {
    console.error("Error fetching payment types:", error.message);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch payment types" },
      { status: 500 }
    );
  }
}
