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
        queryBuilder = queryBuilder.ilike('location', `%${locationList[0]}%`);
      }
    }
    
    if (query.search) {
      queryBuilder = queryBuilder.ilike('name', `%${query.search}%`);
    }

    const { data: results, count: totalCount, error } = await queryBuilder
      .order('created_at', { ascending: false })
      .range(offset, offset + query.limit - 1);

    if (error) throw error;

    return NextResponse.json({
      vendors: results || [],
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
