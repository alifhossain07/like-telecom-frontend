import { NextRequest, NextResponse } from "next/server";
import { getBearerToken } from "@/app/lib/auth-utils";

const API_BASE = process.env.API_BASE!;
const SYSTEM_KEY = process.env.SYSTEM_KEY!;

export const dynamic = "force-dynamic";

/**
 * POST /api/profile/update-image
 * Updates the user's profile image.
 * 
 * Headers:
 * - Authorization: Bearer {token} (required)
 * 
 * Body:
 * {
 *   "image": "base64_encoded_image_string",
 *   "filename": "profile.jpg"
 * }
 * 
 * Backend: POST /api/v2/profile/update-image
 */
export async function POST(req: NextRequest) {
  try {
    if (!API_BASE || !SYSTEM_KEY) {
      return NextResponse.json(
        { success: false, message: "API_BASE or SYSTEM_KEY not configured" },
        { status: 500 }
      );
    }

    // Extract Bearer token from Authorization header
    const bearerToken = getBearerToken(req);
    if (!bearerToken) {
      return NextResponse.json(
        { success: false, message: "Authorization token required" },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await req.json();

    // Validate body
    if (!body.image || !body.filename) {
      return NextResponse.json(
        { success: false, message: "Image and filename are required" },
        { status: 400 }
      );
    }

    // Build headers
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
      "System-Key": SYSTEM_KEY,
      Authorization: `Bearer ${bearerToken}`,
    };

    // Call backend API
    const res = await fetch(`${API_BASE}/profile/update-image`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
      cache: "no-cache",
    });

    const json = await res.json();
    return NextResponse.json(json, { status: res.status });
  } catch (error) {
    console.error("Profile image update API error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update profile image" },
      { status: 500 }
    );
  }
}
