import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { images } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { url, alt } = body;

    const image = await db.insert(images).values({
      id: nanoid(),
      vendorId: params.id,
      url,
      alt,
    }).returning();

    return NextResponse.json(image[0]);
  } catch (error) {
    console.error("Error creating image:", error);
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
    const vendorImages = await db
      .select()
      .from(images)
      .where(eq(images.vendorId, params.id))
      .all();

    return NextResponse.json(vendorImages);
  } catch (error) {
    console.error("Error fetching images:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}