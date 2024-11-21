import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.toLowerCase() || '';
    
    let queryBuilder = supabase.from('locations').select('*');
    
    if (query) {
      queryBuilder = queryBuilder.or(`city.ilike.%${query}%,state_name.ilike.%${query}%`);
    }

    const { data: locations, error } = await queryBuilder.limit(10);

    if (error) throw error;

    const formattedLocations = (locations || []).map(location => ({
      id: location.id,
      label: `${location.city}, ${location.state_id}`,
      city: location.city,
      state: location.state_id
    }));
    
    return NextResponse.json(formattedLocations);
  } catch (error) {
    console.error("Error fetching locations:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
