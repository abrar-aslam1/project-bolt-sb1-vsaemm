import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const vendor = await db.get(
      'SELECT * FROM vendors WHERE id = ?',
      [params.id]
    );

    if (!vendor) {
      return NextResponse.json(
        { error: "Vendor not found" },
        { status: 404 }
      );
    }

    const [reviews, images] = await Promise.all([
      db.query(
        'SELECT * FROM reviews WHERE vendor_id = ? ORDER BY created_at DESC',
        [params.id]
      ),
      db.query(
        'SELECT * FROM images WHERE vendor_id = ? ORDER BY created_at DESC',
        [params.id]
      ),
    ]);

    return NextResponse.json({
      ...vendor,
      reviews,
      images,
    });
  } catch (error) {
    console.error("Error fetching vendor:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
