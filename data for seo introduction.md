# Project Bolt SEO Data Guidelines

## Location Data Optimization
Our location data in `lib/locations.ts` drives local SEO through:
- City/state specific landing pages
- Schema.org structured data markup
- Geo-targeted meta tags
- Location-based content clusters

### Key Strategies:
1. **Dynamic Title Tags**  
`<title>Top {Category} in {City}, {State} | Project Bolt</title>`

2. **Canonical URLs**  
`https://projectbolt.com/top/restaurants/new-york/ny`

3. **Local Business Schema**  
```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Project Bolt - {City}",
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": {lat},
    "longitude": {lng}
  }
}
```

4. **Content Optimization**  
- Use city/state names 3-5 times in page content
- Include location modifiers in headers:
  `## Best Restaurants in {City}`
  
## Technical SEO Requirements

```ts
// Example from locations.ts
export const locationCoordinates = {
  'new-york': { lat: 40.7128, lng: -74.0060 },
  // ... other locations
};
```

### Implementation Checklist:
- [x] Generate sitemap.xml with location URLs
- [x] Implement hreflang tags for multi-state coverage
- [ ] Add JSON-LD for all location pages
- [ ] Create location-based meta descriptions

## Monitoring & Reporting
Track keyword rankings for:
- "best {category} in {city}"
- "{city} {service} reviews" 
- "top rated {category} {state}"

### Performance Metrics:
```ts
// Example tracking implementation
const seoMetrics = {
  visibility: 85.4,
  rankings: {
    top3: 12,
    top10: 28,
    top100: 63
  },
  organicTraffic: 15400
};
```

## Local Search Optimization
1. **NAP Consistency**  
Ensure Name/Address/Phone matches across:
- Google Business Profile
- Apple Maps Connect
- Local directories

2. **Review Management**  
Monitor and respond to reviews on:
- Google
- Yelp
- Industry-specific platforms

3. **Localized Content**  
Create location-specific content clusters:
```
/top/restaurants/new-york
/top/hotels/chicago
/top/attractions/los-angeles
```

## API Documentation Reference

For full DataForSEO API documentation including:
- Authentication details
- Rate limits
- Response formats
- SDK examples

Visit the official [DataForSEO API Documentation Hub](https://docs.dataforseo.com/)

This API is designed to provide you with the top 100 SERP results from Google Maps search
The returned results are specific to the indicated keyword, search engine, and location parameters. Note that the results this endpoint provides are based on the “search this area” parameter, as it’s the only way to perform the search within a custom location in Google Maps. Please, make sure to select this parameter when checking the results to get accurate SERP positions.

Example of Google Maps search engine results:



We emulate set location and search engine with the highest accuracy so that the results you receive will match the actual search results for the specified parameters at the time of task setting. You can always check the returned results accessing the check_url in the Incognito mode to make sure the received data is entirely relevant. Note that user preferences, search history, and other personalized search factors are ignored by our system and thus would not be reflected in the returned SERP results.

You can indicate the following device types and OS you would like to receive Google Maps results for when setting a task:

Mobile. Available OS types: iOS, Android
Desktop. Available OS types: Windows, macOS
 

Google Maps SERP functions
 
Google Maps SERP Advanced endpoint provides data on the top 100 search engine results for the specified keyword, search engine, and location.
 

Methods
 
The cost of using Google Maps SERP endpoints depends on the selected method and priority of task execution. Available methods and priorities are described below.

DataForSEO has two main methods to deliver SERP results: Standard and Live.

If your system requires delivering instant results, the Live method is the best solution for you. Unlike the Standard method, this method doesn’t require making separate POST and GET requests to the corresponding endpoints.

If you don’t need to receive data in real-time, you can use the Standard method of data retrieval. This method requires making separate POST and GET requests, but it’s more affordable. Using this method, you can retrieve the results after our system collects them.

‌Alternatively, you can specify pingback_url or postback_url when setting a task, and we will notify you on completion of tasks or send the results to you respectively. Note that if you use the postback_url field, you should also indicate the advanced function that will be applied for data retrieval.

If you use the Standard method without specifying pingback_url or postback_url, you can receive the list of id for all completed tasks using the ‘Tasks Ready’ endpoint. It is designed to provide you with a list of completed tasks, which haven’t been collected yet. Then, you can retrieve the results using the ‘Task GET’ endpoint.

Learn more about task completion and obtaining a list of completed tasks in this help center article.

You can send up to 2000 POST and GET API calls per minute in total, with each POST call containing no more than 100 tasks. Contact us if you would like to raise the limit. ‌ 

Priorities and cost
 
The Live method delivers results in real-time, and accordingly, the cost of requests made using this method will be the highest.

The Standard method has two different priorities that stand for the relative speed of task execution and have different prices:

1. Normal priority;
2. High priority.

Note: setting depth above the default value will increase the cost of the task. For example, if the default value is 100, you will be billed for every 100 results. So, if you specify "depth": 150, the price for the task will be multiplied by 2 and you will be billed as for 200 results.

The cost can be calculated on the Pricing page.
