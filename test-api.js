const axios = require('axios');

// Test search with specific category and location
const requestData = [{
    keyword: "wedding venues in New York",
    language_code: "en",
    location_code: 1023191,  // Location code for New York, NY
    limit: 20,
    filters: [
        ["rating.value", ">", 4]
    ]
}];

console.log('Testing search with parameters:', JSON.stringify(requestData, null, 2));

const instance = axios.create({
    timeout: 30000, // 30 second timeout
    headers: {
        'content-type': 'application/json'
    }
});

instance({
    method: 'post',
    url: 'https://api.dataforseo.com/v3/serp/google/maps/live/advanced',
    auth: {
        username: 'abrar@amarosystems.com',
        password: '69084d8c8dcf81cd'
    },
    data: requestData
}).then(function (response) {
    console.log('\nAPI Response Status:', response.data.status_code, response.data.status_message);
    
    const result = response.data?.tasks?.[0]?.result?.[0];
    if (result) {
        console.log('\nSearch Statistics:');
        console.log('Total count:', result.total_count);
        console.log('Items returned:', result.items?.length);
        
        if (result.items && result.items.length > 0) {
            console.log('\nRaw first item:', JSON.stringify(result.items[0], null, 2));
            
            console.log('\nFirst 5 Results:');
            result.items.slice(0, 5).forEach((item, index) => {
                console.log(`\n${index + 1}. ${item.title}`);
                console.log(`Address: ${item.address}`);
                if (item.rating) {
                    console.log(`Rating: ${item.rating.value} (${item.rating.votes_count} reviews)`);
                }
                if (item.phone) {
                    console.log(`Phone: ${item.phone}`);
                }
                if (item.url) {
                    console.log(`Website: ${item.url}`);
                }
                if (item.main_image) {
                    console.log(`Image: ${item.main_image}`);
                }
                if (item.address_info) {
                    console.log('Location:', JSON.stringify(item.address_info, null, 2));
                }
            });

            // Log distribution of ratings
            const ratingDistribution = result.items.reduce((acc, item) => {
                const rating = Math.floor(item.rating?.value || 0);
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
            console.log('Full result:', JSON.stringify(result, null, 2));
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
