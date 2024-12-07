import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { PlaceInquiry } from '@/lib/models/place';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { name, email, phone, message, category, city, state, placeId } = data;

    // Basic validation
    if (!name || !email || !phone || !message || !category || !city || !state) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('wedding_directory');
    const collection = db.collection('inquiries');

    const inquiry: PlaceInquiry = {
      name,
      email,
      phone,
      message,
      category: category.toLowerCase(),
      city: city.toLowerCase(),
      state: state.toLowerCase(),
      placeId,
      submittedAt: new Date(),
      status: 'new',
      metadata: {
        userAgent: request.headers.get('user-agent'),
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown'
      }
    };

    await collection.insertOne(inquiry);

    return NextResponse.json(
      { message: 'Inquiry submitted successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error submitting inquiry:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
