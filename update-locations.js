import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jbohbzkwmhjhpezbmmuv.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impib2hiemt3bWhqaHBlemJtbXV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIxNTY1ODMsImV4cCI6MjA0NzczMjU4M30.uJw070pcoZWfV40TDxQm4ZrSi9tDzJT3w2iGiOoL3PE';

const supabase = createClient(supabaseUrl, supabaseKey);

// Map state names to abbreviations
const stateAbbreviations = {
  'California': 'CA',
  'New York': 'NY',
  'Texas': 'TX',
  'Florida': 'FL',
  'Illinois': 'IL',
  'Pennsylvania': 'PA',
  'Arizona': 'AZ',
  'Georgia': 'GA',
  'Washington': 'WA',
  'Massachusetts': 'MA'
};

function formatLocation(location) {
  // Split location into city and state
  const [city, stateAbbr] = location.split(',').map(part => part.trim());
  
  // If we have a state abbreviation, verify it's correct
  if (stateAbbr && stateAbbr.length === 2) {
    return `${city}, ${stateAbbr.toUpperCase()}`;
  }
  
  // Try to find the state name in the location string
  const foundState = Object.entries(stateAbbreviations).find(([stateName]) =>
    location.toLowerCase().includes(stateName.toLowerCase())
  );
  
  if (foundState) {
    return `${city}, ${foundState[1]}`;
  }
  
  return location;
}

async function updateLocations() {
  try {
    // Get all vendors
    const { data: vendors, error: fetchError } = await supabase
      .from('vendors')
      .select('*');

    if (fetchError) throw fetchError;

    console.log(`Found ${vendors?.length || 0} vendors to process`);

    // Update each vendor's location
    for (const vendor of vendors || []) {
      const newLocation = formatLocation(vendor.location);
      
      // Only update if the location format has changed
      if (newLocation !== vendor.location) {
        const { error: updateError } = await supabase
          .from('vendors')
          .update({ location: newLocation })
          .eq('id', vendor.id);

        if (updateError) {
          console.error(`Error updating ${vendor.name}:`, updateError);
        } else {
          console.log(`Updated ${vendor.name} location from "${vendor.location}" to "${newLocation}"`);
        }
      }
    }

    console.log('Location updates complete!');
  } catch (error) {
    console.error('Error updating locations:', error);
  }
}

// Run the update
updateLocations();
