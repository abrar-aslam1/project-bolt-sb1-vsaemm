import { NextResponse } from "next/server";
import { db } from "@/lib/db";
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
    
    let sql = 'SELECT * FROM vendors WHERE 1=1';
    const params: any[] = [];
    
    if (query.category && query.category !== "All Categories") {
      sql += ' AND category = ?';
      params.push(query.category);
    }
    
    if (query.location) {
      sql += ' AND location LIKE ?';
      params.push(`%${query.location}%`);
    }
    
    if (query.search) {
      sql += ' AND name LIKE ?';
      params.push(`%${query.search}%`);
    }
    
    sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(query.limit, offset);
    
    const countSql = sql.replace('SELECT *', 'SELECT COUNT(*) as count')
                       .split('ORDER BY')[0];
    
    const [results, countResult] = await Promise.all([
      db.query(sql, params),
      db.get(countSql, params.slice(0, -2))
    ]);
    
    const totalCount = countResult?.count || 0;
    
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
