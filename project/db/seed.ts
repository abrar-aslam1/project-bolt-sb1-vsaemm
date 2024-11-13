import { db } from './index';
import { v4 as uuidv4 } from 'uuid';

const seedVendors = [
  {
    id: uuidv4(),
    name: 'Elegant Events',
    category: 'Wedding Planners',
    location: 'New York, NY',
    description: 'Full-service wedding planning and coordination',
    phone: '(123) 456-7890',
    email: 'info@elegantevents.com',
    website: 'https://elegantevents.com',
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
  },
];

async function seed() {
  console.log('Seeding database...');
  
  try {
    // Create tables if they don't exist
    await new Promise((resolve, reject) => {
      db.run(`
        CREATE TABLE IF NOT EXISTS vendors (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          category TEXT NOT NULL,
          location TEXT NOT NULL,
          description TEXT,
          phone TEXT,
          email TEXT,
          website TEXT,
          created_at INTEGER NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => err ? reject(err) : resolve(undefined));
    });

    await new Promise((resolve, reject) => {
      db.run(`
        CREATE TABLE IF NOT EXISTS reviews (
          id TEXT PRIMARY KEY,
          vendor_id TEXT NOT NULL,
          rating INTEGER NOT NULL,
          comment TEXT,
          user_name TEXT NOT NULL,
          created_at INTEGER NOT NULL DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (vendor_id) REFERENCES vendors (id) ON DELETE CASCADE
        )
      `, (err) => err ? reject(err) : resolve(undefined));
    });

    // Clear existing data
    await new Promise((resolve) => {
      db.run('DELETE FROM reviews', [], () => resolve(undefined));
    });
    await new Promise((resolve) => {
      db.run('DELETE FROM vendors', [], () => resolve(undefined));
    });

    // Insert vendors
    for (const vendor of seedVendors) {
      await new Promise((resolve, reject) => {
        db.run(
          'INSERT INTO vendors (id, name, category, location, description, phone, email, website) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          [vendor.id, vendor.name, vendor.category, vendor.location, vendor.description, vendor.phone, vendor.email, vendor.website],
          (err) => err ? reject(err) : resolve(undefined)
        );
      });

      // Add a review for each vendor
      await new Promise((resolve, reject) => {
        db.run(
          'INSERT INTO reviews (id, vendor_id, rating, comment, user_name) VALUES (?, ?, ?, ?, ?)',
          [uuidv4(), vendor.id, 5, 'Excellent service!', 'John Doe'],
          (err) => err ? reject(err) : resolve(undefined)
        );
      });
    }

    console.log('Seeding complete!');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed();