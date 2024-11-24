import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Supabase client
const supabaseUrl = 'https://jbohbzkwmhjhpezbmmuv.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impib2hiemt3bWhqaHBlemJtbXV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDExMzk2MDAsImV4cCI6MjAxNjcxNTYwMH0.SbUXk6hxBqBPJqGM68Y_4iB0Rx_Iu_C4SxM4J0-xhYE';
const supabase = createClient(supabaseUrl, supabaseKey);

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

async function seed() {
  console.log('Seeding database...');
  
  try {
    // Clear existing data
    await supabase.from('reviews').delete().neq('id', '0');
    await supabase.from('images').delete().neq('id', '0');
    await supabase.from('vendors').delete().neq('id', '0');

    // Load and insert actual business data from locations.csv
    const locations = loadLocations();
    
    for (const location of locations) {
      const vendorId = uuidv4();
      
      const vendor = {
        id: vendorId,
        name: location.business,
        category: location.category,
        location: `${location.city}, ${location.state_id}`,
        description: `Premier ${location.category.toLowerCase()} in ${location.city}, ${location.state_name}`,
        phone: '(123) 456-7890', // placeholder
        email: `contact@${location.business.toLowerCase().replace(/\s+/g, '')}.com`, // generated email
        website: `https://${location.business.toLowerCase().replace(/\s+/g, '')}.com`, // generated website
        created_at: new Date().toISOString()
      };

      // Insert vendor
      const { error: vendorError } = await supabase
        .from('vendors')
        .insert(vendor);

      if (vendorError) throw vendorError;

      // Add a sample review
      const review = {
        id: uuidv4(),
        vendor_id: vendorId,
        rating: 5,
        comment: 'Excellent service!',
        user_name: 'John Doe',
        created_at: new Date().toISOString()
      };

      const { error: reviewError } = await supabase
        .from('reviews')
        .insert(review);

      if (reviewError) throw reviewError;
    }

    console.log('Seeding complete!');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed();
