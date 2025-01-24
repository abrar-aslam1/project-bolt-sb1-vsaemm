import { NextResponse } from 'next/server';
import { PlacesService } from '@/lib/services/places-service';

export async function POST(request: Request) {
  try {
    const { category, city, state } = await request.json();
    
    if (!category || !city || !state) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Get mock data directly from the service
    const places = await PlacesService.searchPlacesAPI(category, city, state);
    
    return NextResponse.json({
      results: places
    });
    
  } catch (error) {
    console.error('Error in places API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch places' },
      { status: 500 }
    );
  }
}
