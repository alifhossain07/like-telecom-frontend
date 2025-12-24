import { NextRequest, NextResponse } from "next/server";

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

    const body = await req.json();

    // Ensure login_by is set to "phone" and use "phone" field instead of "email"
    const loginBody = {
      login_by: "phone",
      phone: body.phone || body.email, // Support both for backward compatibility
      password: body.password,
    };

    const res = await fetch(`${apiBase}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "System-Key": systemKey,
      },
      body: JSON.stringify(loginBody),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (e) {
    console.error("Login proxy error:", e);
    return NextResponse.json(
      { result: false, message: "Login failed" },
      { status: 500 }
    );
  }
}