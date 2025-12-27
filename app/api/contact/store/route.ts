import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, content } = await request.json();
    
    const apiBase = process.env.API_BASE!; // e.g., http://like.test/api/v2
    const systemKey = process.env.SYSTEM_KEY!;
    
    if (!apiBase || !systemKey) {
      return NextResponse.json(
        { result: false, message: 'API config missing' },
        { status: 500 }
      );
    }

    const payload = {
      name,
      email,
      phone,
      content,
    };

    const response = await fetch(`${apiBase}/contact/store`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'System-Key': systemKey,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json(
      { result: false, message: 'Failed to submit contact form' },
      { status: 500 }
    );
  }
}
