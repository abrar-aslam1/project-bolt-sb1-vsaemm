import { NextResponse } from 'next/server';
import { PlacesService } from 'lib/services/places-service';

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

    console.log('API Request:', { category, city, state });

    const places = await PlacesService.getTopPlaces(category, city, state);
    
    console.log('API Response:', {
      category,
      city,
      state,
      placesCount: places.length
    });

    return NextResponse.json(places);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An error occurred' },
      { status: 500 }
    );
  }
}

// Add OPTIONS handler for CORS
export async function OPTIONS(request: Request) {
  return NextResponse.json({}, { status: 200 });
}
