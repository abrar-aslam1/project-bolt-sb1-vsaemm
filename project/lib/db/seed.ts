import { db } from './index';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

const fallbackLocations = [
  { id: '1', city: 'New York', state_id: 'NY', state_name: 'New York' },
  { id: '2', city: 'Los Angeles', state_id: 'CA', state_name: 'California' },
  { id: '3', city: 'Chicago', state_id: 'IL', state_name: 'Illinois' },
  { id: '4', city: 'Houston', state_id: 'TX', state_name: 'Texas' },
  { id: '5', city: 'Miami', state_id: 'FL', state_name: 'Florida' },
  { id: '6', city: 'San Francisco', state_id: 'CA', state_name: 'California' },
  { id: '7', city: 'Boston', state_id: 'MA', state_name: 'Massachusetts' },
  { id: '8', city: 'Seattle', state_id: 'WA', state_name: 'Washington' },
  { id: '9', city: 'Denver', state_id: 'CO', state_name: 'Colorado' },
  { id: '10', city: 'Austin', state_id: 'TX', state_name: 'Texas' }
];

function loadLocations() {
  try {
    const csvPath = path.join(process.cwd(), 'locations.csv');
    console.log('Loading locations from:', csvPath);
    
    const locationsFile = fs.readFileSync(csvPath, 'utf-8');
    console.log('File content length:', locationsFile.length);
    
    if (locationsFile.length === 0) {
      console.log('CSV file is empty, using fallback locations');
      return fallbackLocations;
    }
    
    const locations = parse(locationsFile, {
      columns: true,
      skip_empty_lines: true
    });
    
    if (!locations || locations.length === 0) {
      console.log('No locations parsed from CSV, using fallback locations');
      return fallbackLocations;
    }
    
    console.log('Parsed locations count:', locations.length);
    return locations;
  } catch (error) {
    console.error('Error loading locations:', error);
    console.log('Using fallback locations');
    return fallbackLocations;
  }
}

const locations = loadLocations();

function getRandomLocation() {
  const location = locations[Math.floor(Math.random() * locations.length)];
  return `${location.city}, ${location.state_id}`;
}

const seedVendors = [
  {
    id: uuidv4(),
    name: 'Elegant Events',
    category: 'Wedding Planners',
    location: getRandomLocation(),
    description: 'Full-service wedding planning and coordination',
    phone: '(123) 456-7890',
    email: 'info@elegantevents.com',
    website: 'https://elegantevents.com',
  },
  {
    id: uuidv4(),
    name: 'Perfect Pictures',
    category: 'Photographers',
    location: getRandomLocation(),
    description: 'Capturing your special moments with style',
    phone: '(234) 567-8901',
    email: 'info@perfectpictures.com',
    website: 'https://perfectpictures.com',
  },
  {
    id: uuidv4(),
    name: 'Floral Fantasy',
    category: 'Florists',
    location: getRandomLocation(),
    description: 'Creating stunning floral arrangements for your special day',
    phone: '(345) 678-9012',
    email: 'info@floralfantasy.com',
    website: 'https://floralfantasy.com',
  },
  {
    id: uuidv4(),
    name: 'Divine DJs',
    category: 'DJs & Bands',
    location: getRandomLocation(),
    description: 'Professional DJs and live bands for weddings',
    phone: '(456) 789-0123',
    email: 'info@divinedjs.com',
    website: 'https://divinedjs.com',
  },
  {
    id: uuidv4(),
    name: 'Sweet Celebrations',
    category: 'Bakeries',
    location: getRandomLocation(),
    description: 'Custom wedding cakes and desserts',
    phone: '(567) 890-1234',
    email: 'info@sweetcelebrations.com',
    website: 'https://sweetcelebrations.com',
  },
  {
    id: uuidv4(),
    name: 'Venue Visions',
    category: 'Venues',
    location: getRandomLocation(),
    description: 'Stunning wedding venues for your special day',
    phone: '(678) 901-2345',
    email: 'info@venuevisions.com',
    website: 'https://venuevisions.com',
  }
];

async function seed() {
  console.log('Seeding database...');
  
  try {
    // Create vendors table
    await db.run(`
      CREATE TABLE IF NOT EXISTS vendors (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        location TEXT NOT NULL,
        description TEXT,
        phone TEXT,
        email TEXT,
        website TEXT,
        created_at INTEGER NOT NULL DEFAULT (unixepoch())
      )
    `);

    // Create reviews table
    await db.run(`
      CREATE TABLE IF NOT EXISTS reviews (
        id TEXT PRIMARY KEY,
        vendor_id TEXT NOT NULL,
        rating INTEGER NOT NULL,
        comment TEXT,
        user_name TEXT NOT NULL,
        created_at INTEGER NOT NULL DEFAULT (unixepoch()),
        FOREIGN KEY (vendor_id) REFERENCES vendors (id) ON DELETE CASCADE
      )
    `);

    // Create images table
    await db.run(`
      CREATE TABLE IF NOT EXISTS images (
        id TEXT PRIMARY KEY,
        vendor_id TEXT NOT NULL,
        url TEXT NOT NULL,
        alt TEXT,
        created_at INTEGER NOT NULL DEFAULT (unixepoch()),
        FOREIGN KEY (vendor_id) REFERENCES vendors (id) ON DELETE CASCADE
      )
    `);

    // Clear existing data
    await db.run('DELETE FROM reviews');
    await db.run('DELETE FROM images');
    await db.run('DELETE FROM vendors');

    // Insert vendors
    for (const vendor of seedVendors) {
      await db.run(
        'INSERT INTO vendors (id, name, category, location, description, phone, email, website) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [vendor.id, vendor.name, vendor.category, vendor.location, vendor.description, vendor.phone, vendor.email, vendor.website]
      );

      // Add a sample review for each vendor
      await db.run(
        'INSERT INTO reviews (id, vendor_id, rating, comment, user_name) VALUES (?, ?, ?, ?, ?)',
        [uuidv4(), vendor.id, 5, 'Excellent service!', 'John Doe']
      );
    }

    console.log('Seeding complete!');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed();
