import { NextResponse } from "next/server";
import { z } from "zod";
import { searchBusinesses } from "../../../lib/dataforseo-client";

const querySchema = z.object({
  category: z.string().optional(),
  location: z.string().optional(),
  search: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
});

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const query = querySchema.parse(Object.fromEntries(url.searchParams));
    
    // Use DataForSEO business listings search
    const searchResults = await searchBusinesses({
      keyword: query.category || 'wedding venue',
      locationName: query.location,
      limit: query.limit,
      minRating: 4
    });

    return NextResponse.json({
      vendors: searchResults.data,
      pagination: {
        currentPage: query.page,
        totalPages: searchResults.pagination.totalPages,
        totalItems: searchResults.pagination.totalResults,
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
