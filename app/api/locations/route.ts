import { NextResponse } from "next/server";
import { citiesByState } from "@/lib/locations";

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.toLowerCase() || '';
    
    // Convert citiesByState to a flat array of locations
    const locations = Object.entries(citiesByState).flatMap(([state, cities]) =>
      cities.map(city => ({
        id: `${city}-${state}`.toLowerCase().replace(/\s+/g, '-'),
        label: `${city}, ${state}`,
        city: city,
        state: state,
        slug: city.toLowerCase().replace(/\s+/g, '-')
      }))
    );

    // Filter locations if query exists
    const filteredLocations = query
      ? locations.filter(loc => 
          loc.city.toLowerCase().includes(query) ||
          loc.state.toLowerCase().includes(query)
        )
      : locations;
    
    return NextResponse.json(filteredLocations.slice(0, 10));
  } catch (error) {
    console.error("Error fetching locations:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
