import { NextResponse } from "next/server";
import { z } from "zod";
import { supabase } from "../../../lib/supabase";

const querySchema = z.object({
  category: z.string().optional(),
  locations: z.string().optional(),
  search: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
});

// Map state names to abbreviations
const stateAbbreviations: Record<string, string> = {
  'California': 'CA',
  'New York': 'NY',
  'Texas': 'TX',
  'Florida': 'FL',
  'Illinois': 'IL',
  'Pennsylvania': 'PA',
  'Arizona': 'AZ',
  'Georgia': 'GA',
  'Washington': 'WA',
  'Massachusetts': 'MA'
};

// Map state abbreviations back to full names
const stateNames: Record<string, string> = Object.entries(stateAbbreviations).reduce((acc: Record<string, string>, [name, abbr]) => {
  acc[abbr] = name;
  return acc;
}, {});

function formatLocation(location: string): string {
  // Split location into city and state
  const [city, stateAbbr] = location.split(',').map(part => part.trim());
  
  // If we have a state abbreviation, verify it's correct
  if (stateAbbr && stateAbbr.length === 2) {
    return `${city}, ${stateAbbr.toUpperCase()}`;
  }
  
  // Try to find the state name in the location string
  const foundState = Object.entries(stateAbbreviations).find(([stateName]) =>
    location.toLowerCase().includes(stateName.toLowerCase())
  );
  
  if (foundState) {
    return `${city}, ${foundState[1]}`;
  }
  
  return location;
}

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const query = querySchema.parse(Object.fromEntries(url.searchParams));
    
    const offset = (query.page - 1) * query.limit;
    let queryBuilder = supabase.from('vendors').select('*', { count: 'exact' });
    
    if (query.category && query.category !== "All Categories") {
      queryBuilder = queryBuilder.eq('category', query.category);
    }
    
    if (query.locations) {
      const locationList = query.locations.split(',').map(loc => loc.trim());
      if (locationList.length > 0) {
        // Convert state abbreviation to full name if needed
        const location = locationList[0];
        const stateAbbr = location.split(',')[1]?.trim();
        const stateName = stateNames[stateAbbr] || stateAbbr;
        
        queryBuilder = queryBuilder.or(`location.ilike.%${location}%,location.ilike.%${stateName}%`);
      }
    }
    
    if (query.search) {
      queryBuilder = queryBuilder.ilike('name', `%${query.search}%`);
    }

    const { data: results, count: totalCount, error } = await queryBuilder
      .order('created_at', { ascending: false })
      .range(offset, offset + query.limit - 1);

    if (error) throw error;

    // Format locations to ensure consistency
    const formattedResults = results?.map(vendor => ({
      ...vendor,
      location: formatLocation(vendor.location)
    }));

    // Update the locations in the database
    if (formattedResults) {
      for (const vendor of formattedResults) {
        const originalVendor = results.find(v => v.id === vendor.id);
        if (vendor.location !== originalVendor?.location) {
          await supabase
            .from('vendors')
            .update({ location: vendor.location })
            .eq('id', vendor.id);
        }
      }
    }

    return NextResponse.json({
      vendors: formattedResults || [],
      pagination: {
        currentPage: query.page,
        totalPages: Math.ceil((totalCount || 0) / query.limit),
        totalItems: totalCount || 0,
      },
    });
  } catch (error) {
    console.error("Error fetching vendors:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid query parameters", details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
