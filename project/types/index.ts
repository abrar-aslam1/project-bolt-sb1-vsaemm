export interface Vendor {
  id: string;
  name: string;
  category: string;
  location: string;
  description: string;
  phone: string;
  email: string;
  website: string;
  created_at: number;
}

export interface Review {
  id: string;
  vendor_id: string;
  rating: number;
  comment: string;
  user_name: string;
  created_at: number;
}

export interface Image {
  id: string;
  vendor_id: string;
  url: string;
  alt: string;
  created_at: number;
}
