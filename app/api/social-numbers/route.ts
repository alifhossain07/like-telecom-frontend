import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

interface BusinessSetting {
    type: string;
    value: string;
}

interface ApiResponse {
    data: BusinessSetting[];
    success: boolean;
    status: number;
}

export async function GET() {
    const API_BASE = process.env.API_BASE;
    const SYSTEM_KEY = process.env.SYSTEM_KEY;

    try {
        const response = await fetch(`${API_BASE}/business-settings`, {
            method: 'GET',
            headers: {
                // Ensure the key is wrapped in quotes in your .env file
                'System-Key': SYSTEM_KEY || '', 
                'Accept': 'application/json',
            },
        });

        const result: ApiResponse = await response.json();

        // 1. Check if data actually exists in the response
        if (!result.data || !Array.isArray(result.data)) {
            console.error('API returned no data array:', result);
            return NextResponse.json([]);
        }

        // 2. Define the exact keys you need
        const targetKeys = ['phone_number', 'messenger_link', 'whatsapp_number'];

        // 3. Filter with .trim() to avoid issues with hidden spaces
        const filteredData = result.data.filter((item: BusinessSetting) => 
            targetKeys.includes(item.type.trim())
        );

        return NextResponse.json(filteredData);

    } catch (error: unknown) {
        return NextResponse.json(
            { error: 'Fetch failed', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}