import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request) {
  try {
    const { category, city, state } = await request.json();
    
    if (!process.env.DATAFORSEO_LOGIN || !process.env.DATAFORSEO_PASSWORD) {
      return NextResponse.json(
        { error: 'Missing DataForSEO credentials' },
        { status: 500 }
      );
    }

    const credentials = Buffer.from(
      `${process.env.DATAFORSEO_LOGIN}:${process.env.DATAFORSEO_PASSWORD}`
    ).toString('base64');

    const response = await axios.post(
      'https://api.dataforseo.com/v3/serp/google/maps/task_get/advanced',
      {
        keyword: `${category} in ${city}, ${state}`,
        location_code: 2840,
        language_code: "en",
        device: "desktop",
        depth: 10
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${credentials}`
        }
      }
    );

    return NextResponse.json(response.data);
    
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch places data' },
      { status: 500 }
    );
  }
}
