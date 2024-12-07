import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error('Please add your Mongo URI to .env.local');
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const queryParam = searchParams.get('q');

    // Return empty array if no query provided
    if (!queryParam) {
      return NextResponse.json([]);
    }

    const client = new MongoClient(uri);
    await client.connect();

    const db = client.db('wedding_vendors');
    const vendors = await db.collection('vendors').find({
      $or: [
        { name: { $regex: queryParam, $options: 'i' } },
        { category: { $regex: queryParam, $options: 'i' } },
        { location: { $regex: queryParam, $options: 'i' } },
        { description: { $regex: queryParam, $options: 'i' } },
      ],
    }).limit(20).toArray();

    await client.close();

    // If no vendors found, return empty array
    if (!vendors.length) {
      return NextResponse.json([]);
    }

    // Transform the data to match the expected format
    const transformedVendors = vendors.map(vendor => ({
      id: vendor._id.toString(),
      name: vendor.name || '',
      category: vendor.category || '',
      description: vendor.description || '',
      location: vendor.location || '',
      rating: vendor.rating || 4.5,
      image: vendor.image || '/placeholder-venue.jpg'
    }));

    return NextResponse.json(transformedVendors);

  } catch (error) {
    console.error('Error fetching vendors:', error);
    return NextResponse.json(
      { error: 'Failed to fetch vendors' },
      { status: 500 }
    );
  }
}
