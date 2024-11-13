import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { vendors, reviews, images } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const vendor = await db.query.vendors.findFirst({
      where: eq(vendors.id, params.id),
    });

    if (!vendor) {
      return NextResponse.json(
        { error: "Vendor not found" },
        { status: 404 }
      );
    }

    const [vendorReviews, vendorImages] = await Promise.all([
      db.select().from(reviews).where(eq(reviews.vendorId, params.id)).all(),
      db.select().from(images).where(eq(images.vendorId, params.id)).all(),
    ]);

    return NextResponse.json({
      ...vendor,
      reviews: vendorReviews,
      images: vendorImages,
    });
  } catch (error) {
    console.error("Error fetching vendor:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}