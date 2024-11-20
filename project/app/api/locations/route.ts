import { NextResponse } from "next/server";
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

interface Location {
  id: string;
  city: string;
  state_id: string;
  state_name: string;
}

const fallbackLocations = [
  { id: '1', city: 'New York', state_id: 'NY', state_name: 'New York' },
  { id: '2', city: 'Los Angeles', state_id: 'CA', state_name: 'California' },
  { id: '3', city: 'Chicago', state_id: 'IL', state_name: 'Illinois' },
  { id: '4', city: 'Houston', state_id: 'TX', state_name: 'Texas' },
  { id: '5', city: 'Miami', state_id: 'FL', state_name: 'Florida' },
  { id: '6', city: 'San Francisco', state_id: 'CA', state_name: 'California' },
  { id: '7', city: 'Boston', state_id: 'MA', state_name: 'Massachusetts' },
  { id: '8', city: 'Seattle', state_id: 'WA', state_name: 'Washington' },
  { id: '9', city: 'Denver', state_id: 'CO', state_name: 'Colorado' },
  { id: '10', city: 'Austin', state_id: 'TX', state_name: 'Texas' }
];

// Cache the locations in memory
let locationsCache: Location[] | null = null;

function getLocations(): Location[] {
  if (locationsCache) return locationsCache;

  try {
    const csvPath = path.join(process.cwd(), 'locations.csv');
    const locationsFile = fs.readFileSync(csvPath, 'utf-8');
    
    if (locationsFile.length === 0) {
      locationsCache = fallbackLocations;
      return fallbackLocations;
    }
    
    const parsedLocations = parse(locationsFile, {
      columns: true,
      skip_empty_lines: true
    }) as Location[];

    if (!parsedLocations || parsedLocations.length === 0) {
      locationsCache = fallbackLocations;
      return fallbackLocations;
    }

    locationsCache = parsedLocations;
    return parsedLocations;
  } catch (error) {
    console.error('Error loading locations:', error);
    locationsCache = fallbackLocations;
    return fallbackLocations;
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.toLowerCase() || '';
    
    const locations = getLocations();
    
    // Filter locations based on the search query
    const filteredLocations = locations
      .filter(location => 
        location.city.toLowerCase().includes(query) ||
        location.state_name.toLowerCase().includes(query)
      )
      .map(location => ({
        id: location.id,
        label: `${location.city}, ${location.state_id}`,
        city: location.city,
        state: location.state_id
      }))
      .slice(0, 10); // Limit to 10 suggestions
    
    return NextResponse.json(filteredLocations);
  } catch (error) {
    console.error("Error fetching locations:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
