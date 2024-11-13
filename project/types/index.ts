export interface Vendor {
  id: string;
  name: string;
  category: string;
  location: string;
  description?: string;
  phone?: string;
  email?: string;
  website?: string;
  createdAt: Date;
}

export interface Review {
  id: string;
  vendorId: string;
  rating: number;
  comment?: string;
  userName: string;
  createdAt: Date;
}