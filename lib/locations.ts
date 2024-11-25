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

// Location codes for DataForSEO API
// Updated with correct DataForSEO location IDs
export const locationCodes: Record<string, number> = {
  // Arizona
  'phoenix': 1013911,
  'tucson': 1013934,
  'scottsdale': 1013922,
  
  // California
  'los-angeles': 1013583,
  'san-francisco': 1013594,
  'san-diego': 1013578,
  'sacramento': 1013577,
  'san-jose': 1013590,
  
  // Colorado
  'denver': 1013611,
  
  // Florida
  'miami': 1013937,
  'orlando': 1013953,
  'tampa': 1013974,
  'jacksonville': 1013936,
  
  // Georgia
  'atlanta': 1013695,
  'savannah': 1013708,
  'augusta': 1013694,
  
  // Illinois
  'chicago': 1013817,
  'springfield': 1013836,
  'rockford': 1013834,
  
  // Massachusetts
  'boston': 1013913,
  'worcester': 1013929,
  'cambridge': 1013914,
  
  // Nevada
  'las-vegas': 1013957,
  
  // New York
  'new-york': 1013581,
  'buffalo': 1013555,
  'rochester': 1013570,
  'albany': 1013550,
  
  // Oregon
  'portland': 1014458,
  
  // Pennsylvania
  'philadelphia': 1013426,
  'pittsburgh': 1013434,
  'harrisburg': 1013421,
  
  // Texas
  'houston': 1013968,
  'dallas': 1013958,
  'austin': 1013947,
  'san-antonio': 1013985,
  'fort-worth': 1013960,
  
  // Washington
  'seattle': 1014094,
  'spokane': 1014099,
  'tacoma': 1014102,
  
  // Tennessee
  'nashville': 1014201,
  
  // Louisiana
  'new-orleans': 1013891
};
