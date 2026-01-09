export interface Listing {
  id: number;
  service_name: string;
  slug: string;
  service_description: string;
  company_name: string;
  company_description: string;
  images: string; // JSON string array
  tagline: string;
  address: string;
  latitude: string;
  longitude: string;
  postcode: string;
  phone: string;
  email: string;
  website: string;
  social_links: string; // JSON string array of objects
  pricing_type: string;
  pricing: string;
  new: number;
  popular: number;
  trending: any;
  reviews_allowed: number;
  average_rating: string;
  rating_count: number;
  views_count: number;
  map_hidden: number;
  owner_contact_hidden: number;
  video_url: string;
  featured: number;
  author: number;
  date_created: string;
  date_modified: string;
  categories: string; // JSON string array
  locations: string; // JSON string array
  status: string;
  verification_status: string;
  keywords: string; // JSON string array
  our_service: number;
  harrow_id: number;
}
