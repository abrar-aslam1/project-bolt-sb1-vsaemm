const axios = require('axios');

// Test search with US parameters using Google Maps
const post_array = [{
    "keyword": "wedding venues",
    "language_code": "en",
    "location_code": 1023191,  // New York, NY, United States
    "coordinates": "40.7128,-74.0060",
    "radius": 50000, // 50km radius
    "limit": 100,
    "filters": [
        ["rating", ">", 4],
        ["reviews_count", ">", 10]
    ],
    "sort_by": "rating.desc"
}];

console.log('Testing search with parameters:', JSON.stringify(post_array, null, 2));

axios({
    method: 'post',
    url: 'https://api.dataforseo.com/v3/serp/google/maps/live/advanced',
    auth: {
        username: 'abrar@amarosystems.com',
        password: '69084d8c8dcf81cd'
    },
    data: post_array,
    headers: {
        'content-type': 'application/json'
    }
}).then(function (response) {
    console.log('\nAPI Response Status:', response.data.status_code, response.data.status_message);
    
    const result = response.data?.tasks?.[0]?.result?.[0];
    if (result) {
        console.log('\nSearch Statistics:');
        console.log('Total count:', result.total_count);
        console.log('Items returned:', result.items?.length);
        
        if (result.items && result.items.length > 0) {
            // Debug first item structure
            console.log('\nFirst item structure:', JSON.stringify(result.items[0], null, 2));

            console.log('\nFirst 10 Results:');
            result.items.slice(0, 10).forEach((item, index) => {
                const rating = typeof item.rating === 'object' ? item.rating.value : item.rating;
                const reviews = typeof item.rating === 'object' ? item.rating.votes_count : item.reviews_count;
                
                console.log(`\n${index + 1}. ${item.title}`);
                if (item.address_info) {
                    console.log(`Location: ${item.address_info.city}, ${item.address_info.state}, ${item.address_info.country}`);
                }
                if (item.address) {
                    console.log(`Address: ${item.address}`);
                }
                if (rating) {
                    console.log(`Rating: ${rating} (${reviews || 0} reviews)`);
                }
                if (item.place_id) {
                    console.log(`Place ID: ${item.place_id}`);
                }
                if (item.website) {
                    console.log(`Website: ${item.website}`);
                }
                if (item.phone) {
                    console.log(`Phone: ${item.phone}`);
                }
                if (item.hours) {
                    console.log('Hours:', item.hours);
                }
                if (item.description) {
                    console.log(`Description: ${item.description}`);
                }
            });

            // Log distribution of ratings
            const ratingDistribution = result.items.reduce((acc, item) => {
                const rating = Math.floor(
                    typeof item.rating === 'object' ? item.rating.value : item.rating
                );
                if (!isNaN(rating)) {
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

            // Log city distribution
            const cityDistribution = result.items.reduce((acc, item) => {
                const city = item.address_info?.city || 'Unknown';
                acc[city] = (acc[city] || 0) + 1;
                return acc;
            }, {});

            console.log('\nCity Distribution:');
            Object.entries(cityDistribution)
                .sort(([,a], [,b]) => b - a)
                .forEach(([city, count]) => {
                    console.log(`${city}: ${count} venues`);
                });
        } else {
            console.log('\nNo items in results');
        }
    } else {
        console.log('\nNo results found');
        if (response.data?.tasks?.[0]?.status_code !== 20000) {
            console.log('Task status:', response.data?.tasks?.[0]?.status_code);
            console.log('Task message:', response.data?.tasks?.[0]?.status_message);
        }
        console.log('Full response:', JSON.stringify(response.data, null, 2));
    }
}).catch(function (error) {
    console.log('Error:', error.message);
    if (error.response) {
        console.log('Error response:', error.response.data);
    }
});
