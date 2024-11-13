import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { vendors } from "@/lib/db/schema";
import { desc, like, sql } from "drizzle-orm";
import { z } from "zod";

const querySchema = z.object({
  category: z.string().optional(),
  location: z.string().optional(),
  search: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = querySchema.parse(Object.fromEntries(searchParams));
    
    const offset = (query.page - 1) * query.limit;
    
    let baseQuery = db.select().from(vendors);
    
    if (query.category && query.category !== "All Categories") {
      baseQuery = baseQuery.where(like(vendors.category, query.category));
    }
    
    if (query.location) {
      baseQuery = baseQuery.where(like(vendors.location, `%${query.location}%`));
    }
    
    if (query.search) {
      baseQuery = baseQuery.where(like(vendors.name, `%${query.search}%`));
    }
    
    const [results, totalCount] = await Promise.all([
      baseQuery
        .orderBy(desc(vendors.createdAt))
        .limit(query.limit)
        .offset(offset)
        .all(),
      db
        .select({ count: sql<number>`count(*)` })
        .from(vendors)
        .get()
        .then((result) => result?.count ?? 0),
    ]);
    
    return NextResponse.json({
      vendors: results,
      pagination: {
        currentPage: query.page,
        totalPages: Math.ceil(totalCount / query.limit),
        totalItems: totalCount,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid query parameters", details: error.errors },
        { status: 400 }
      );
    }
    
    console.error("Error fetching vendors:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}