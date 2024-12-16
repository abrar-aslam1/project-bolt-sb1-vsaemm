import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
    
    if (!GOOGLE_API_KEY) {
      return NextResponse.json({
        error: 'GOOGLE_API_KEY is not set',
        envVars: {
          nodeEnv: process.env.NODE_ENV,
          hasGoogleKey: !!process.env.GOOGLE_API_KEY,
        }
      }, { status: 500 });
    }

    // Test the Google Places API with a simple query
    const url = `https://places.googleapis.com/v1/places:searchText`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': GOOGLE_API_KEY,
        'X-Goog-FieldMask': 'places.id,places.displayName'
      },
      body: JSON.stringify({
        textQuery: 'Wedding Photographer in Phoenix, AZ',
        locationBias: {
          circle: {
            center: {
              latitude: 33.4484,
              longitude: -112.0740
            },
            radius: 10000
          }
        },
        maxResultCount: 1,
        languageCode: "en"
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({
        error: 'Google Places API error',
        status: response.status,
        statusText: response.statusText,
        details: errorText,
        headers: Object.fromEntries(response.headers.entries())
      }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json({
      success: true,
      apiKeyLength: GOOGLE_API_KEY.length,
      apiKeyPrefix: GOOGLE_API_KEY.substring(0, 8) + '...',
      response: data
    });
  } catch (error) {
    console.error('Test API Error:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'An unknown error occurred',
      stack: process.env.NODE_ENV === 'development' ? error instanceof Error ? error.stack : undefined : undefined
    }, { status: 500 });
  }
}
