import { NextResponse } from "next/server";
import axios from "axios";

const API_BASE = process.env.API_BASE!;
const SYSTEM_KEY = process.env.SYSTEM_KEY!;

export async function GET() {
  try {
    const res = await axios.get(`${API_BASE}/flash-deals`, {
      headers: { Accept: "application/json", "System-Key": SYSTEM_KEY },
    });

    // Return the exact API response structure
    return NextResponse.json({
      data: res.data.data || [],
      success: res.data.success ?? true,
      status: res.data.status ?? 200
    });
  } catch (error) {
    console.error("Error fetching Flash Sale data:", error);
    return NextResponse.json({ 
      data: [],
      success: false, 
      status: 500,
      error: "Failed to fetch flash sale data" 
    }, { status: 500 });
  }
}
