import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { reviews } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { rating, comment, userName } = body;

    const review = await db.insert(reviews).values({
      id: nanoid(),
      vendorId: params.id,
      rating,
      comment,
      userName,
    }).returning();

    return NextResponse.json(review[0]);
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const vendorReviews = await db
      .select()
      .from(reviews)
      .where(eq(reviews.vendorId, params.id))
      .all();

    return NextResponse.json(vendorReviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}