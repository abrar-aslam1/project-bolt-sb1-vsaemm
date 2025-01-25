// Cities and states that are supported by the Google Places API
export const citiesByState: Record<string, string[]> = {
  'California': ['Los Angeles', 'San Francisco', 'San Diego', 'Sacramento', 'San Jose'],
  'New York': ['New York', 'Buffalo', 'Rochester', 'Albany'],
  'Texas': ['Houston', 'Dallas', 'Austin', 'San Antonio', 'Fort Worth'],
  'Florida': ['Miami', 'Orlando', 'Tampa', 'Jacksonville'],
  'Illinois': ['Chicago', 'Springfield', 'Rockford'],
  'Pennsylvania': ['Philadelphia', 'Pittsburgh', 'Harrisburg'],
  'Arizona': ['Phoenix', 'Tucson', 'Scottsdale'],
  'Georgia': ['Atlanta', 'Savannah', 'Augusta'],
  'Washington': ['Seattle', 'Spokane', 'Tacoma'],
  'Massachusetts': ['Boston', 'Worcester', 'Cambridge'],
  'Nevada': ['Las Vegas'],
  'Oregon': ['Portland'],
  'Tennessee': ['Nashville'],
  'Louisiana': ['New Orleans'],
  'Colorado': ['Denver']
};

// Location coordinates for Google Places API
// Format: "latitude,longitude,radius"
export const locationCoordinates: Record<string, {lat: number, lng: number}> = {
  // Example coordinates - should match actual supported locations
  'new-york': { lat: 40.7128, lng: -74.0060 },
  'los-angeles': { lat: 34.0522, lng: -118.2437 },
  'chicago': { lat: 41.8781, lng: -87.6298 },
  
  // Arizona
  'phoenix': { lat: 33.4484, lng: -112.0740 },
  'tucson': { lat: 32.2226, lng: -110.9747 },
  'scottsdale': { lat: 33.4942, lng: -111.9261 },
  
  // California
  'san-francisco': { lat: 37.7749, lng: -122.4194 },
  'san-diego': { lat: 32.7157, lng: -117.1611 },
  'sacramento': { lat: 38.5816, lng: -121.4944 },
  'san-jose': { lat: 37.3382, lng: -121.8863 },
  
  // Colorado
  'denver': { lat: 39.7392, lng: -104.9903 },
  
  // Florida
  'miami': { lat: 25.7617, lng: -80.1918 },
  'orlando': { lat: 28.5383, lng: -81.3792 },
  'tampa': { lat: 27.9506, lng: -82.4572 },
  'jacksonville': { lat: 30.3322, lng: -81.6557 },
  
  // Georgia
  'atlanta': { lat: 33.7490, lng: -84.3880 },
  'savannah': { lat: 32.0809, lng: -81.0912 },
  'augusta': { lat: 33.4735, lng: -81.9748 },
  
  // Illinois
  'springfield': { lat: 39.7817, lng: -89.6501 },
  'rockford': { lat: 42.2711, lng: -89.0937 },
  
  // Massachusetts
  'boston': { lat: 42.3601, lng: -71.0589 },
  'worcester': { lat: 42.2626, lng: -71.8023 },
  'cambridge': { lat: 42.3736, lng: -71.1097 },
  
  // Nevada
  'las-vegas': { lat: 36.1699, lng: -115.1398 },
  
  // New York
  'buffalo': { lat: 42.8864, lng: -78.8784 },
  'rochester': { lat: 43.1566, lng: -77.6088 },
  'albany': { lat: 42.6526, lng: -73.7562 },
  
  // Oregon
  'portland': { lat: 45.5155, lng: -122.6789 },
  
  // Pennsylvania
  'philadelphia': { lat: 39.9526, lng: -75.1652 },
  'pittsburgh': { lat: 40.4406, lng: -79.9959 },
  'harrisburg': { lat: 40.2732, lng: -76.8867 },
  
  // Texas
  'houston': { lat: 29.7604, lng: -95.3698 },
  'dallas': { lat: 32.7767, lng: -96.7970 },
  'austin': { lat: 30.2672, lng: -97.7431 },
  'san-antonio': { lat: 29.4241, lng: -98.4936 },
  'fort-worth': { lat: 32.7555, lng: -97.3308 },
  
  // Washington
  'seattle': { lat: 47.6062, lng: -122.3321 },
  'spokane': { lat: 47.6587, lng: -117.4260 },
  'tacoma': { lat: 47.2529, lng: -122.4443 },
  
  // Tennessee
  'nashville': { lat: 36.1627, lng: -86.7816 },
  
  // Louisiana
  'new-orleans': { lat: 29.9511, lng: -90.0715 }
};
