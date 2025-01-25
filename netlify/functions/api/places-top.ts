import { Handler } from '@netlify/functions';
import axios from 'axios';

if (!process.env.DATAFORSEO_LOGIN || !process.env.DATAFORSEO_PASSWORD) {
  throw new Error('Missing DataForSEO credentials');
}
const credentials = Buffer.from(`${process.env.DATAFORSEO_LOGIN}:${process.env.DATAFORSEO_PASSWORD}`).toString('base64');

export const handler: Handler = async (event) => {
  // Validate required parameters from POST body
  const body = JSON.parse(event.body || '{}');
  if (!body.category || !body.city || !body.state) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing required parameters: category, city, state' })
    };
  }

  try {
    const response = await axios.post(
      'https://api.dataforseo.com/v3/serp/google/maps/task_get/advanced',
      {
        keyword: `${body.category} in ${body.city}, ${body.state}`,
        location_code: 2840,
        language_code: "en",
        device: "desktop",
        depth: 10
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${credentials}`
        }
      }
    );

    return {
      statusCode: 200,
      body: JSON.stringify(response.data)
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        statusCode: error.response?.status || 500,
        body: JSON.stringify({ 
          error: error.message,
          details: error.response?.data 
        })
      };
    }
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'An unexpected error occurred' })
    };
  }
};
