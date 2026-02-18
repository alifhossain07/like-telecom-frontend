import { NextRequest, NextResponse } from "next/server";
import { getBearerToken } from "@/app/lib/auth-utils";

export async function POST(req: NextRequest) {
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

    const body = await req.json();

    const res = await fetch(`${apiBase}/club-point/apply-discount`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "System-Key": systemKey,
        "Authorization": `Bearer ${bearerToken}`,
        "Accept": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (e) {
    console.error("Apply club points discount proxy error:", e);
    return NextResponse.json(
      { result: false, message: "Applying club points discount failed" },
      { status: 500 }
    );
  }
}
