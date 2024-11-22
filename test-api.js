const post_array = [];
post_array.push({
    "categories": [
      "pizza_restaurant"
    ],
    "description": "pizza",
    "title": "pizza",
    "is_claimed": true,
    "location_coordinate": "53.476225,-2.243572,10",
    "order_by": [
      "rating.value,desc"
    ],
    "filters": [
      [
        "rating.value",
        ">",
        3
      ]
    ],
    "limit": 3
});

const axios = require('axios');
axios({
  method: 'post',
  url: 'https://api.dataforseo.com/v3/business_data/business_listings/search/live',
  auth: {
    username: 'abrar@amarosystems.com',
    password: '69084d8c8dcf81cd'
  },
  data: post_array,
  headers: {
    'content-type': 'application/json'
  }
}).then(function (response) {
  var result = response['data']['tasks'];
  // Result data
  console.log(JSON.stringify(result, null, 2));
}).catch(function (error) {
  if (error.response) {
    console.log('Error response:', error.response.data);
  } else {
    console.log('Error:', error.message);
  }
});
