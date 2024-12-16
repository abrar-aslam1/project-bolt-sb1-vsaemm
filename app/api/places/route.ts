import { NextRequest, NextResponse } from 'next/server';
import { PlacesService } from 'lib/services/places-service';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { city, state } = body;

    if (!city || !state) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    console.log('API Request:', { city, state });

    // Get valid locations for the city/state
    const locations = await PlacesService.getValidLocations();
    const validCategories = await PlacesService.getValidCategories();
    
    console.log('API Response:', {
      city,
      state,
      locationsCount: locations.length,
      categoriesCount: validCategories.length
    });

    return NextResponse.json({
      locations,
      categories: validCategories,
      metadata: {
        city,
        state,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An error occurred' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const city = searchParams.get('city');
    const state = searchParams.get('state');

    if (!city || !state) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    console.log('API Request:', { city, state });

    // Get valid locations for the city/state
    const locations = await PlacesService.getValidLocations();
    const validCategories = await PlacesService.getValidCategories();
    
    console.log('API Response:', {
      city,
      state,
      locationsCount: locations.length,
      categoriesCount: validCategories.length
    });

    return NextResponse.json({
      locations,
      categories: validCategories,
      metadata: {
        city,
        state,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An error occurred' },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
