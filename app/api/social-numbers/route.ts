import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Define the structure of individual setting items
interface BusinessSetting {
    type: string;
    value: string;
}

// Define the expected API response structure
interface ApiResponse {
    data: BusinessSetting[];
}

export async function GET() {
    const API_BASE = process.env.API_BASE;
    const SYSTEM_KEY = process.env.SYSTEM_KEY;

    try {
        const response = await fetch(`${API_BASE}/business-settings`, {
            method: 'GET',
            headers: {
                'System-Key': SYSTEM_KEY || '', 
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            return NextResponse.json(
                { error: `Failed to fetch: ${response.statusText}` }, 
                { status: response.status }
            );
        }

        const result: ApiResponse = await response.json();

        // The specific types you requested
        const targetKeys = ['whatsapp_number', 'messenger_link', 'phone_number'];

        // Filter for the specific objects
        const filteredData = result.data.filter((item: BusinessSetting) => 
            targetKeys.includes(item.type)
        );

        return NextResponse.json(filteredData, {
            headers: {
                'Cache-Control': 'no-store, max-age=0',
            }
        });

    } catch (error: unknown) {
        return NextResponse.json(
            { 
                error: 'Internal Server Error', 
                details: error instanceof Error ? error.message : 'Unknown error' 
            },
            { status: 500 }
        );
    }
}