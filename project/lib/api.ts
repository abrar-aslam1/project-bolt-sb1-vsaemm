import apiClient from './api-client';
import { z } from 'zod';

const vendorSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string(),
  description: z.string().nullable(),
  location: z.string(),
  phone: z.string().nullable(),
  email: z.string().nullable(),
  website: z.string().nullable(),
  createdAt: z.number(),
});

const reviewSchema = z.object({
  id: z.string(),
  vendorId: z.string(),
  rating: z.number(),
  comment: z.string().nullable(),
  userName: z.string(),
  createdAt: z.number(),
});

const imageSchema = z.object({
  id: z.string(),
  vendorId: z.string(),
  url: z.string(),
  alt: z.string().nullable(),
  createdAt: z.number(),
});

const vendorResponseSchema = vendorSchema.extend({
  reviews: z.array(reviewSchema),
  images: z.array(imageSchema),
});

const vendorsResponseSchema = z.object({
  vendors: z.array(vendorSchema),
  pagination: z.object({
    currentPage: z.number(),
    totalPages: z.number(),
    totalItems: z.number(),
  }),
});

const photoDetailsSchema = z.object({
  businessId: z.string(),
  photoId: z.string(),
  photoUrl: z.string().optional(),
  photoDetails: z.any().optional(), // Define more specific schema based on actual response
});

export type Vendor = z.infer<typeof vendorSchema>;
export type VendorWithDetails = z.infer<typeof vendorResponseSchema>;
export type VendorsResponse = z.infer<typeof vendorsResponseSchema>;
export type PhotoDetails = z.infer<typeof photoDetailsSchema>;

// Create a separate client for RapidAPI calls
const rapidApiClient = apiClient.create({
  baseURL: 'https://local-business-data.p.rapidapi.com',
});

export async function getVendors(params: {
  category?: string;
  location?: string;
  search?: string;
  page?: number;
  limit?: number;
}) {
  const response = await apiClient.get('/vendors', { params });
  return vendorsResponseSchema.parse(response.data);
}

export async function getVendor(id: string) {
  const response = await apiClient.get(`/vendors/${id}`);
  return vendorResponseSchema.parse(response.data);
}

export async function createReview(vendorId: string, data: {
  rating: number;
  comment?: string;
  userName: string;
}) {
  const response = await apiClient.post(`/vendors/${vendorId}/reviews`, data);
  return reviewSchema.parse(response.data);
}

export async function createImage(vendorId: string, data: {
  url: string;
  alt?: string;
}) {
  const response = await apiClient.post(`/vendors/${vendorId}/images`, data);
  return imageSchema.parse(response.data);
}

export async function getPhotoDetails(params: {
  businessId: string;
  photoId: string;
}): Promise<PhotoDetails> {
  try {
    const response = await rapidApiClient.get('/photo-details', {
      params: {
        business_id: params.businessId,
        photo_id: params.photoId
      }
    });

    return photoDetailsSchema.parse(response.data);
  } catch (error) {
    console.error('Error fetching photo details:', error);
    throw error;
  }
}
