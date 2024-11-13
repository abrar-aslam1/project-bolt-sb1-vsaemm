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

export type Vendor = z.infer<typeof vendorSchema>;
export type VendorWithDetails = z.infer<typeof vendorResponseSchema>;
export type VendorsResponse = z.infer<typeof vendorsResponseSchema>;

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