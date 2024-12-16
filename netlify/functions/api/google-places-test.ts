import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';

export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  try {
    const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
    
    if (!GOOGLE_API_KEY) {
      console.error('GOOGLE_API_KEY not found in environment variables');
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: 'Server configuration error - Google API key not found',
          envVars: {
            nodeEnv: process.env.NODE_ENV,
            hasGoogleKey: !!process.env.GOOGLE_API_KEY,
          }
        }),
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      };
    }

    // Test the Google Places API with a simple query
    const url = `https://places.googleapis.com/v1/places:searchText`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': GOOGLE_API_KEY,
        'X-Goog-FieldMask': 'places.id,places.displayName'
      },
      body: JSON.stringify({
        textQuery: 'Wedding Photographer in Phoenix, AZ',
        locationBias: {
          circle: {
            center: {
              latitude: 33.4484,
              longitude: -112.0740
            },
            radius: 10000
          }
        },
        maxResultCount: 1,
        languageCode: "en"
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Google Places API Error:', errorText);
      return {
        statusCode: response.status,
        body: JSON.stringify({
          error: 'Google Places API error',
          status: response.status,
          statusText: response.statusText,
          details: errorText,
          headers: Object.fromEntries(response.headers.entries())
        }),
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      };
    }

    const data = await response.json();
    console.log('Google Places API Response:', data);
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        apiKeyLength: GOOGLE_API_KEY.length,
        apiKeyPrefix: GOOGLE_API_KEY.substring(0, 8) + '...',
        response: data
      }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    };
  } catch (error) {
    console.error('Test API Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error instanceof Error ? error.message : 'An unknown error occurred',
        stack: process.env.NODE_ENV === 'development' ? error instanceof Error ? error.stack : undefined : undefined
      }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    };
  }
};
