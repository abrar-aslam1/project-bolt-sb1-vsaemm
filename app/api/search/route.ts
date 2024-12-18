import { NextRequest, NextResponse } from 'next/server';
import { parseSearchQuery } from '@/lib/utils';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      );
    }

    const parsed = parseSearchQuery(query);
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

    // Forward the request to the Netlify function
    const response = await fetch(`${baseUrl}/.netlify/functions/api/places-search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        category: parsed.category || 'venue',
        city: parsed.city || 'New York',
        state: parsed.state || 'New York'
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Netlify function error:', errorText);
      return NextResponse.json(
        { error: `Failed to fetch places: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query } = body;

    if (!query) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      );
    }

    const parsed = parseSearchQuery(query);
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

    // Forward the request to the Netlify function
    const response = await fetch(`${baseUrl}/.netlify/functions/api/places-search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        category: parsed.category || 'venue',
        city: parsed.city || 'New York',
        state: parsed.state || 'New York'
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Netlify function error:', errorText);
      return NextResponse.json(
        { error: `Failed to fetch places: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
