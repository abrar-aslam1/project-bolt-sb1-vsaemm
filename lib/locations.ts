// Cities and states that are supported by the DataForSEO API
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

// Location coordinates for DataForSEO API
// Format: "latitude,longitude,radius"
export const locationCoordinates: Record<string, string> = {
  // Arizona
  'phoenix': '33.4484,-112.0740,10',
  'tucson': '32.2226,-110.9747,10',
  'scottsdale': '33.4942,-111.9261,10',
  
  // California
  'los-angeles': '34.1139,-118.4068,10',
  'san-francisco': '37.7749,-122.4194,10',
  'san-diego': '32.7157,-117.1611,10',
  'sacramento': '38.5816,-121.4944,10',
  'san-jose': '37.3382,-121.8863,10',
  
  // Colorado
  'denver': '39.7392,-104.9903,10',
  
  // Florida
  'miami': '25.7617,-80.1918,10',
  'orlando': '28.5383,-81.3792,10',
  'tampa': '27.9506,-82.4572,10',
  'jacksonville': '30.3322,-81.6557,10',
  
  // Georgia
  'atlanta': '33.7490,-84.3880,10',
  'savannah': '32.0809,-81.0912,10',
  'augusta': '33.4735,-81.9748,10',
  
  // Illinois
  'chicago': '41.8781,-87.6298,10',
  'springfield': '39.7817,-89.6501,10',
  'rockford': '42.2711,-89.0937,10',
  
  // Massachusetts
  'boston': '42.3601,-71.0589,10',
  'worcester': '42.2626,-71.8023,10',
  'cambridge': '42.3736,-71.1097,10',
  
  // Nevada
  'las-vegas': '36.1699,-115.1398,10',
  
  // New York
  'new-york': '40.7128,-74.0060,10',
  'buffalo': '42.8864,-78.8784,10',
  'rochester': '43.1566,-77.6088,10',
  'albany': '42.6526,-73.7562,10',
  
  // Oregon
  'portland': '45.5155,-122.6789,10',
  
  // Pennsylvania
  'philadelphia': '39.9526,-75.1652,10',
  'pittsburgh': '40.4406,-79.9959,10',
  'harrisburg': '40.2732,-76.8867,10',
  
  // Texas
  'houston': '29.7604,-95.3698,10',
  'dallas': '32.7767,-96.7970,10',
  'austin': '30.2672,-97.7431,10',
  'san-antonio': '29.4241,-98.4936,10',
  'fort-worth': '32.7555,-97.3308,10',
  
  // Washington
  'seattle': '47.6062,-122.3321,10',
  'spokane': '47.6587,-117.4260,10',
  'tacoma': '47.2529,-122.4443,10',
  
  // Tennessee
  'nashville': '36.1627,-86.7816,10',
  
  // Louisiana
  'new-orleans': '29.9511,-90.0715,10'
};
