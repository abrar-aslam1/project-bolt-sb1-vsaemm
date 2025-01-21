# Wedding Vendor API Documentation

## Base URL
`/api`

## Endpoints

### Search Places
**POST** `/places`

Search for wedding vendors in a specific location.

#### Request Body
```json
{
  "category": "string", // e.g. "venue", "photographer"
  "city": "string",     // e.g. "Chicago"
  "state": "string"     // e.g. "IL"
}
```

#### Response
```json
{
  "results": [
    {
      "placeId": "string",
      "name": "string",
      "address": "string",
      "rating": number,
      "totalRatings": number,
      "priceLevel": "string",
      "website": "string",
      "location": {
        "type": "Point",
        "coordinates": [number, number]
      }
    }
  ]
}
```

#### Supported Categories
- Wedding Venue
- Wedding Photographer
- Wedding Caterer
- Wedding Florist
- Wedding Planner
- Wedding Dress Shop
- Wedding Makeup Artist
- Wedding DJ

#### Example Request
```bash
curl -X POST /api/places \
  -H "Content-Type: application/json" \
  -d '{
    "category": "venue",
    "city": "Chicago",
    "state": "IL"
  }'
```

#### Example Response
```json
{
  "results": [
    {
      "placeId": "ChIJN1t_tDeuEmsRUsoyG83frY4",
      "name": "The Ritz-Carlton, Chicago",
      "address": "160 E Pearson St, Chicago, IL 60611, United States",
      "rating": 4.7,
      "totalRatings": 1234,
      "priceLevel": "$$$$",
      "website": "https://www.ritzcarlton.com/",
      "location": {
        "type": "Point",
        "coordinates": [-87.6244, 41.8974]
      }
    }
  ]
}
```

## Error Responses
- **400 Bad Request**: Missing required fields
- **500 Internal Server Error**: Failed to fetch places
