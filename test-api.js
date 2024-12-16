require('dotenv').config();
const axios = require('axios');

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

if (!GOOGLE_API_KEY) {
  console.error('GOOGLE_API_KEY environment variable is required');
  process.exit(1);
}

async function testGooglePlacesAPI() {
  try {
    const url = 'https://places.googleapis.com/v1/places:searchText';
    const response = await axios({
      method: 'post',
      url,
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': GOOGLE_API_KEY,
        'X-Goog-FieldMask': [
          'places.id',
          'places.displayName',
          'places.formattedAddress',
          'places.rating',
          'places.userRatingCount',
          'places.priceLevel',
          'places.websiteUri',
          'places.location'
        ].join(',')
      },
      data: {
        textQuery: 'Wedding Venues in New York',
        locationBias: {
          circle: {
            center: {
              latitude: 40.7128,
              longitude: -74.0060
            },
            radius: 10000
          }
        },
        maxResultCount: 20,
        languageCode: "en"
      }
    });

    console.log('\nAPI Response Status:', response.status);
    
    const places = response.data.places;
    if (places && places.length > 0) {
      console.log('\nTotal Results:', places.length);
      
      console.log('\nRaw first item:', JSON.stringify(places[0], null, 2));
      
      console.log('\nFirst 5 Results:');
      places.slice(0, 5).forEach((place, index) => {
        console.log(`\n${index + 1}. ${place.displayName.text}`);
        console.log(`Address: ${place.formattedAddress}`);
        if (place.rating) {
          console.log(`Rating: ${place.rating} (${place.userRatingCount} reviews)`);
        }
        if (place.websiteUri) {
          console.log(`Website: ${place.websiteUri}`);
        }
        if (place.location) {
          console.log('Location:', JSON.stringify(place.location, null, 2));
        }
      });

      // Log rating distribution
      const ratingDistribution = places.reduce((acc, place) => {
        const rating = Math.floor(place.rating || 0);
        if (rating > 0) {
          acc[rating] = (acc[rating] || 0) + 1;
        }
        return acc;
      }, {});
      
      console.log('\nRating Distribution:');
      Object.entries(ratingDistribution)
        .sort(([a], [b]) => b - a)
        .forEach(([rating, count]) => {
          console.log(`${rating} stars: ${count} venues`);
        });

    } else {
      console.log('\nNo places found in results');
      console.log('Full response:', JSON.stringify(response.data, null, 2));
    }
  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Error response:', error.response.data);
    }
  }
}

testGooglePlacesAPI();
