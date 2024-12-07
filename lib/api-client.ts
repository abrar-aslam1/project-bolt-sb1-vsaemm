import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || '/api',
  headers: {
    'x-rapidapi-host': process.env.NEXT_PUBLIC_RAPIDAPI_HOST,
    'x-rapidapi-key': process.env.NEXT_PUBLIC_RAPIDAPI_KEY,
  },
});

export default apiClient;
