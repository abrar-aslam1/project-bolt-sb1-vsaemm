import { NextRequest, NextResponse } from 'next/server';
import { PlacesService } from '@/lib/services/places-service';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const city = searchParams.get('city');
    const state = searchParams.get('state');

    if (!category || !city || !state) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    console.log('Fetching top places for:', { category, city, state });
    const places = await PlacesService.getTopPlaces(category, city, state);
    console.log('Found places:', places.length);
    
    return NextResponse.json({ results: places });
  } catch (error: any) {
    console.error('Error in top places API:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch top places' },
      { status: 500 }
    );
  }
}
