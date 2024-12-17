import { NextRequest, NextResponse } from 'next/server';
import { PlacesService } from '@/lib/services/places-service';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { category, city, state } = body;

    if (!category || !city || !state) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const places = await PlacesService.searchPlaces(category, city, state);
    return NextResponse.json({ results: places });
  } catch (error) {
    console.error('Error in places API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch places' },
      { status: 500 }
    );
  }
}
