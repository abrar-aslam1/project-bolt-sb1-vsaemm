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
export const locationCodes: Record<string, number> = {
  'phoenix': 1015214,
  'tucson': 1015239,
  'scottsdale': 1015227,
  'los-angeles': 1012873,
  'san-francisco': 1014895,
  'san-diego': 1014847,
  'sacramento': 1014836,
  'san-jose': 1014873,
  'denver': 1020432,
  'miami': 1015031,
  'orlando': 1015116,
  'tampa': 1015215,
  'jacksonville': 1014997,
  'atlanta': 1015254,
  'savannah': 1015225,
  'augusta': 1015253,
  'chicago': 1016367,
  'springfield': 1016598,
  'rockford': 1016573,
  'boston': 1018127,
  'worcester': 1018289,
  'cambridge': 1018139,
  'new-york': 1023191,
  'buffalo': 1023083,
  'rochester': 1023333,
  'albany': 1023048,
  'las-vegas': 1022658,
  'portland': 1024543,
  'philadelphia': 1025197,
  'pittsburgh': 1025202,
  'harrisburg': 1025123,
  'houston': 1021990,
  'dallas': 1020466,
  'austin': 1015688,
  'san-antonio': 1015843,
  'fort-worth': 1020851,
  'seattle': 1024765,
  'spokane': 1024784,
  'tacoma': 1024801,
  'nashville': 1025854,
  'new-orleans': 1022534
};
