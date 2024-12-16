import { NextResponse } from 'next/server';
import { PlacesService, categoryMapping } from 'lib/services/places-service';
import { locationCoordinates } from 'lib/locations';

const normalizeString = (str: string): string => {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').trim();
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { category, city, state } = body;

    if (!category || !city || !state) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Normalize inputs
    const normalizedCategory = normalizeString(category);
    const normalizedCity = normalizeString(city);
    const normalizedState = state.toLowerCase();

    console.log('API Request:', { 
      category: normalizedCategory, 
      city: normalizedCity, 
      state: normalizedState 
    });

    // Validate category
    if (!Object.keys(categoryMapping).includes(normalizedCategory)) {
      console.error('Invalid category:', normalizedCategory);
      return NextResponse.json(
        { error: `Invalid category: ${category}` },
        { status: 400 }
      );
    }

    // Validate city
    if (!locationCoordinates[normalizedCity]) {
      console.error('City not supported:', normalizedCity);
      return NextResponse.json(
        { error: `City not supported: ${city}` },
        { status: 400 }
      );
    }

    const places = await PlacesService.getTopPlaces(
      normalizedCategory,
      normalizedCity,
      normalizedState
    );
    
    console.log('API Response:', {
      category: normalizedCategory,
      city: normalizedCity,
      state: normalizedState,
      placesCount: places.length
    });

    return NextResponse.json({
      results: places,
      metadata: {
        category: normalizedCategory,
        mappedCategory: categoryMapping[normalizedCategory],
        city: normalizedCity,
        state: normalizedState,
        count: places.length,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'An error occurred',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    );
  }
}

// Keep GET handler for backward compatibility
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const city = searchParams.get('city');
    const state = searchParams.get('state');

    if (!category || !city || !state) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Normalize inputs
    const normalizedCategory = normalizeString(category);
    const normalizedCity = normalizeString(city);
    const normalizedState = state.toLowerCase();

    console.log('API Request:', { 
      category: normalizedCategory, 
      city: normalizedCity, 
      state: normalizedState 
    });

    // Validate category
    if (!Object.keys(categoryMapping).includes(normalizedCategory)) {
      console.error('Invalid category:', normalizedCategory);
      return NextResponse.json(
        { error: `Invalid category: ${category}` },
        { status: 400 }
      );
    }

    // Validate city
    if (!locationCoordinates[normalizedCity]) {
      console.error('City not supported:', normalizedCity);
      return NextResponse.json(
        { error: `City not supported: ${city}` },
        { status: 400 }
      );
    }

    const places = await PlacesService.getTopPlaces(
      normalizedCategory,
      normalizedCity,
      normalizedState
    );
    
    console.log('API Response:', {
      category: normalizedCategory,
      city: normalizedCity,
      state: normalizedState,
      placesCount: places.length
    });

    return NextResponse.json({
      results: places,
      metadata: {
        category: normalizedCategory,
        mappedCategory: categoryMapping[normalizedCategory],
        city: normalizedCity,
        state: normalizedState,
        count: places.length,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'An error occurred',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    );
  }
}

// Add OPTIONS handler for CORS
export async function OPTIONS(request: Request) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
