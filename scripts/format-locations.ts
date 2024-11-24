import { supabase } from '../lib/supabase';

interface Vendor {
  id: string;
  name: string;
  location: string;
  [key: string]: any;
}

const stateAbbreviations: Record<string, string> = {
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

async function formatLocations() {
  try {
    // Get all vendors
    const { data: vendors, error: fetchError } = await supabase
      .from('vendors')
      .select('*');

    if (fetchError) throw fetchError;

    console.log(`Found ${vendors?.length || 0} vendors to process`);

    // Process each vendor
    for (const vendor of (vendors || []) as Vendor[]) {
      const location = vendor.location;
      console.log(`Processing ${vendor.name} - Current location: ${location}`);

      // Split location into city and state
      const [city, stateAbbr] = location.split(',').map((part: string) => part.trim());

      let newLocation = location;

      // If we have a state abbreviation, verify it's correct
      if (stateAbbr && stateAbbr.length === 2) {
        newLocation = `${city}, ${stateAbbr.toUpperCase()}`;
      } else {
        // Try to find the state name in the location string
        const foundState = Object.entries(stateAbbreviations).find(([stateName]) =>
          location.toLowerCase().includes(stateName.toLowerCase())
        );

        if (foundState) {
          newLocation = `${city}, ${foundState[1]}`;
        }
      }

      // Only update if the location format has changed
      if (newLocation !== location) {
        const { error: updateError } = await supabase
          .from('vendors')
          .update({ location: newLocation })
          .eq('id', vendor.id);

        if (updateError) {
          console.error(`Error updating ${vendor.name}:`, updateError);
        } else {
          console.log(`Updated ${vendor.name} location from "${location}" to "${newLocation}"`);
        }
      }
    }

    console.log('Location formatting complete!');
  } catch (error) {
    console.error('Error formatting locations:', error);
  }
}

// Run the script
formatLocations();
