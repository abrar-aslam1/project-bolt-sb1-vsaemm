import { db } from './index';
import { vendors, reviews } from './schema';
import { v4 as uuidv4 } from 'uuid';

const seedVendors = [
  {
    id: uuidv4(),
    name: 'Elegant Events',
    category: 'Wedding Planners',
    location: 'Boston, MA',
    description: 'Full-service wedding planning and coordination',
    phone: '(123) 456-7890',
    email: 'info@elegantevents.com',
    website: 'https://elegantevents.com',
    createdAt: new Date()
  },
  {
    id: uuidv4(),
    name: 'Perfect Pictures',
    category: 'Photographers',
    location: 'Los Angeles, CA',
    description: 'Capturing your special moments with style',
    phone: '(234) 567-8901',
    email: 'info@perfectpictures.com',
    website: 'https://perfectpictures.com',
    createdAt: new Date()
  },
  {
    id: uuidv4(),
    name: 'Floral Fantasy',
    category: 'Florists',
    location: 'Chicago, IL',
    description: 'Creating stunning floral arrangements for your special day',
    phone: '(345) 678-9012',
    email: 'info@floralfantasy.com',
    website: 'https://floralfantasy.com',
    createdAt: new Date()
  },
  {
    id: uuidv4(),
    name: 'Divine DJs',
    category: 'DJs & Bands',
    location: 'Miami, FL',
    description: 'Professional DJs and live bands for weddings',
    phone: '(456) 789-0123',
    email: 'info@divinedjs.com',
    website: 'https://divinedjs.com',
    createdAt: new Date()
  },
];

async function seed() {
  try {
    console.log('Starting database seeding...');

    console.log('Deleting existing data...');
    await db.delete(reviews).execute();
    await db.delete(vendors).execute();
    console.log('Existing data deleted successfully');

    console.log('Inserting vendors...');
    for (const vendor of seedVendors) {
      console.log(`Inserting vendor: ${vendor.name}`);
      await db.insert(vendors).values(vendor).execute();

      console.log(`Adding review for vendor: ${vendor.name}`);
      await db.insert(reviews).values({
        id: uuidv4(),
        vendorId: vendor.id,
        rating: 5,
        comment: 'Excellent service!',
        userName: 'John Doe',
        createdAt: new Date()
      }).execute();
    }

    console.log('Verifying data...');
    const insertedVendors = await db.select().from(vendors).execute();
    console.log(`Successfully inserted ${insertedVendors.length} vendors`);

    const insertedReviews = await db.select().from(reviews).execute();
    console.log(`Successfully inserted ${insertedReviews.length} reviews`);

    console.log('Seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
}

seed();
