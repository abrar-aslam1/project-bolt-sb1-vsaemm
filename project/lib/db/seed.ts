import { db } from './index';
import { vendors, reviews, images } from './schema';
import { nanoid } from 'nanoid';

async function seed() {
  try {
    // Create sample vendors
    const vendorIds = await Promise.all([
      db.insert(vendors).values({
        id: nanoid(),
        name: "Elegant Events",
        category: "Wedding Planners",
        description: "Full-service wedding planning and coordination for your special day.",
        location: "New York, NY",
        phone: "212-555-0123",
        email: "info@elegantevents.com",
        website: "https://elegantevents.com"
      }),
      db.insert(vendors).values({
        id: nanoid(),
        name: "Capture Perfect",
        category: "Photographers",
        description: "Professional wedding photography capturing timeless moments.",
        location: "Los Angeles, CA",
        phone: "323-555-0124",
        email: "hello@captureperfect.com",
        website: "https://captureperfect.com"
      }),
      db.insert(vendors).values({
        id: nanoid(),
        name: "Floral Dreams",
        category: "Florists",
        description: "Creating stunning floral arrangements for weddings and events.",
        location: "Chicago, IL",
        phone: "312-555-0125",
        email: "flowers@floraldreams.com",
        website: "https://floraldreams.com"
      })
    ]);

    // Add sample reviews
    await Promise.all(vendorIds.map(async (result) => {
      const vendorId = result.lastInsertRowid.toString();
      await db.insert(reviews).values([
        {
          id: nanoid(),
          vendorId,
          rating: 5,
          comment: "Amazing service! Made our wedding day perfect.",
          userName: "Sarah Johnson"
        },
        {
          id: nanoid(),
          vendorId,
          rating: 4,
          comment: "Great experience working with them.",
          userName: "Michael Brown"
        }
      ]);

      // Add sample images
      await db.insert(images).values([
        {
          id: nanoid(),
          vendorId,
          url: `https://source.unsplash.com/random/800x600?wedding,${Math.random()}`,
          alt: "Wedding venue decoration"
        },
        {
          id: nanoid(),
          vendorId,
          url: `https://source.unsplash.com/random/800x600?bride,${Math.random()}`,
          alt: "Wedding ceremony"
        }
      ]);
    }));

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed();