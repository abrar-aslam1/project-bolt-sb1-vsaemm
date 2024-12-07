const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error('Please add your Mongo URI to .env.local');
}

const sampleVendors = [
  {
    name: "Grand Plaza Wedding Venue",
    category: "venues",
    description: "A luxurious wedding venue with stunning city views and elegant ballrooms",
    location: "Los Angeles, CA",
    rating: 4.8,
    image: "/placeholder-venue.jpg"
  },
  {
    name: "Crystal Gardens",
    category: "venues",
    description: "Beautiful garden venue perfect for outdoor ceremonies and receptions",
    location: "San Francisco, CA",
    rating: 4.7,
    image: "/placeholder-venue.jpg"
  },
  {
    name: "Elite Photography Studio",
    category: "photographers",
    description: "Professional wedding photography with a creative and artistic touch",
    location: "New York, NY",
    rating: 4.9,
    image: "/placeholder-venue.jpg"
  },
  {
    name: "Gourmet Wedding Catering",
    category: "catering",
    description: "Exquisite catering service specializing in international cuisine",
    location: "Chicago, IL",
    rating: 4.6,
    image: "/placeholder-venue.jpg"
  },
  {
    name: "Blooming Bouquets",
    category: "florists",
    description: "Custom floral designs for your special day",
    location: "Miami, FL",
    rating: 4.8,
    image: "/placeholder-venue.jpg"
  }
];

async function seedDatabase() {
  try {
    const client = new MongoClient(uri);
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db('wedding_vendors');
    const collection = db.collection('vendors');

    // Clear existing data
    await collection.deleteMany({});
    console.log('Cleared existing data');

    // Insert sample vendors
    const result = await collection.insertMany(sampleVendors);
    console.log(`Inserted ${result.insertedCount} vendors`);

    await client.close();
    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
