import { NextRequest, NextResponse } from "next/server";
import { getBearerToken } from "@/app/lib/auth-utils";

export async function GET(req: NextRequest) {
  try {
    const apiBase = process.env.API_BASE;
    const systemKey = process.env.SYSTEM_KEY;

    if (!apiBase || !systemKey) {
      return NextResponse.json(
        { result: false, message: "API_BASE or SYSTEM_KEY not configured" },
        { status: 500 }
      );
    }

    const bearerToken = getBearerToken(req);
    if (!bearerToken) {
      return NextResponse.json(
        { result: false, message: "Authorization token required" },
        { status: 401 }
      );
    }

    const res = await fetch(`${apiBase}/clubpoint/get-list`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "System-Key": systemKey,
        "Authorization": `Bearer ${bearerToken}`,
        "Accept": "application/json",
      },
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (e) {
    console.error("Club points list proxy error:", e);
    return NextResponse.json(
      { result: false, message: "Fetching club points list failed" },
      { status: 500 }
    );
  }
}
