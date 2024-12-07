import { ObjectId } from 'mongodb';

export interface Place {
  _id?: ObjectId;
  placeId: string;
  name: string;
  address: string;
  city: string;
  state: string;
  category: string;
  rating?: number;
  totalRatings?: number;
  priceLevel?: string;
  website?: string;
  phoneNumber?: string;
  location: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  cached: Date;
}

export interface PlaceInquiry {
  _id?: ObjectId;
  name: string;
  email: string;
  phone: string;
  placeId?: string;
  message: string;
  category: string;
  city: string;
  state: string;
  submittedAt: Date;
  status: 'new' | 'contacted' | 'completed';
  metadata?: Record<string, any>;
}

export interface CachedSearch {
  _id?: ObjectId;
  query: string;
  category: string;
  city: string;
  state: string;
  results: Place[];
  lastUpdated: Date;
  totalResults: number;
}
