import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export const dynamic = "force-dynamic";

// Proxies external pickup-point details API - fetches from like.test/api/v2/pickup-point/{id}
export async function GET(
    _req: NextRequest,
    { params }: { params: { id: string } }
) {
    const { id } = params;
    const API_BASE = process.env.API_BASE;
    const SYSTEM_KEY = process.env.SYSTEM_KEY;

    if (!API_BASE || !SYSTEM_KEY) {
        return NextResponse.json(
            { success: false, message: "Server configuration error" },
            { status: 500 }
        );
    }

    const url = `${API_BASE}/pickup-point/${id}`;

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
        console.error(`Error fetching pickup point ${id} from API:`, err);
        if (axios.isAxiosError(err)) {
            return NextResponse.json(
                {
                    success: false,
                    message: err.response?.data?.message || err.message || "Failed to fetch pickup point details",
                },
                { status: err.response?.status || 500 }
            );
        }
        return NextResponse.json(
            { success: false, message: "Unexpected error fetching pickup point details" },
            { status: 500 }
        );
    }
}
