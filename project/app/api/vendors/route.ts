import { NextResponse } from "next/server";
import { db } from "../../../db";
import { vendors } from "../../../db/schema";
import { z } from "zod";
import { and, eq, like, desc, sql } from "drizzle-orm";

const querySchema = z.object({
  category: z.string().optional(),
  locations: z.string().optional(),
  search: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
});

interface CountResult {
  count: number;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = querySchema.parse(Object.fromEntries(searchParams));
    
    console.log('Query params:', query);
    
    const offset = (query.page - 1) * query.limit;
    
    const conditions = [];
    
    if (query.category && query.category !== "All Categories") {
      console.log('Adding category filter:', query.category);
      conditions.push(eq(vendors.category, query.category));
    }
    
    if (query.locations) {
      const locationList = query.locations.split(',').map(loc => loc.trim());
      if (locationList.length > 0) {
        console.log('Adding location filter:', locationList[0]);
        conditions.push(like(vendors.location, `%${locationList[0]}%`));
      }
    }
    
    if (query.search) {
      console.log('Adding search filter:', query.search);
      conditions.push(like(vendors.name, `%${query.search}%`));
    }

    console.log('Executing query with conditions:', conditions);

    const results = await db
      .select()
      .from(vendors)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(vendors.createdAt))
      .limit(query.limit)
      .offset(offset);

    console.log('Query results:', results);

    const totalCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(vendors)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .then((result) => (result[0] as CountResult).count);
    
    console.log('Total count:', totalCount);

    return NextResponse.json({
      vendors: results,
      pagination: {
        currentPage: query.page,
        totalPages: Math.ceil(totalCount / query.limit),
        totalItems: totalCount,
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
