import clientPromise from '../mongodb';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

// Map of states to their full names
const stateNames: Record<string, string> = {
  'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas',
  'CA': 'California', 'CO': 'Colorado', 'CT': 'Connecticut', 'DE': 'Delaware',
  'FL': 'Florida', 'GA': 'Georgia', 'HI': 'Hawaii', 'ID': 'Idaho',
  'IL': 'Illinois', 'IN': 'Indiana', 'IA': 'Iowa', 'KS': 'Kansas',
  'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine', 'MD': 'Maryland',
  'MA': 'Massachusetts', 'MI': 'Michigan', 'MN': 'Minnesota', 'MS': 'Mississippi',
  'MO': 'Missouri', 'MT': 'Montana', 'NE': 'Nebraska', 'NV': 'Nevada',
  'NH': 'New Hampshire', 'NJ': 'New Jersey', 'NM': 'New Mexico', 'NY': 'New York',
  'NC': 'North Carolina', 'ND': 'North Dakota', 'OH': 'Ohio', 'OK': 'Oklahoma',
  'OR': 'Oregon', 'PA': 'Pennsylvania', 'RI': 'Rhode Island', 'SC': 'South Carolina',
  'SD': 'South Dakota', 'TN': 'Tennessee', 'TX': 'Texas', 'UT': 'Utah',
  'VT': 'Vermont', 'VA': 'Virginia', 'WA': 'Washington', 'WV': 'West Virginia',
  'WI': 'Wisconsin', 'WY': 'Wyoming'
};

function loadLocations() {
  try {
    const csvPath = path.join(process.cwd(), 'locations.csv');
    console.log('Loading locations from:', csvPath);
    
    const locationsFile = fs.readFileSync(csvPath, 'utf-8');
    console.log('File content length:', locationsFile.length);
    
    const locations = parse(locationsFile, {
      columns: true,
      skip_empty_lines: true
    });
    
    if (!locations || locations.length === 0) {
      throw new Error('No locations parsed from CSV');
    }
    
    console.log('Parsed locations count:', locations.length);
    return locations;
  } catch (error) {
    console.error('Error loading locations:', error);
    throw error;
  }
}

// Function to format location string
function formatLocation(city: string, state_id: string): string {
  const stateName = stateNames[state_id] || state_id;
  return `${city}, ${state_id}`;
}

async function seed() {
  console.log('Seeding database...');
  
  try {
    // Load and insert actual business data from locations.csv
    const locations = loadLocations();
    
    const client = await clientPromise;
    const db = client.db();
    
    // Clear existing data
    await db.collection('vendors').deleteMany({});

    for (const location of locations) {
      const formattedLocation = formatLocation(location.city, location.state_id);
      
      const vendor = {
        id: uuidv4(),
        name: location.business,
        category: location.category,
        location: formattedLocation,
        description: `Premier ${location.category.toLowerCase()} in ${location.city}, ${location.state_name}`,
        phone: '(123) 456-7890', // placeholder
        email: `contact@${location.business.toLowerCase().replace(/\s+/g, '')}.com`,
        website: `https://${location.business.toLowerCase().replace(/\s+/g, '')}.com`,
        created_at: new Date().toISOString()
      };

      await db.collection('vendors').insertOne(vendor);

      // Add a sample review
      await db.collection('reviews').insertOne({
        id: uuidv4(),
        vendor_id: vendor.id,
        rating: 5,
        comment: 'Excellent service!',
        user_name: 'John Doe',
        created_at: new Date().toISOString()
      });
    }

    console.log('Seeding complete!');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed();
