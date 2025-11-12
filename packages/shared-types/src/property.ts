export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  address: string;
  city: string;
  state: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  bedrooms: number;
  bathrooms: number;
  area: number;
  images: string[];
  isVerified: boolean;
  rating: number;
  reviews: number;
  type: PropertyType;
  status: PropertyStatus;
  features: string[];
  amenities: string[];
  availability: string;
  createdAt: string;
  updatedAt: string;
  agent: PropertyAgent;
  contactInfo: ContactInfo;
}

export type PropertyType = 'apartment' | 'house' | 'commercial' | 'studio' | 'duplex';

export type PropertyStatus = 'available' | 'rented' | 'under_maintenance' | 'coming_soon';

export interface PropertyAgent {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  rating: number;
  properties: number;
  verified: boolean;
  agency?: string;
}

export interface ContactInfo {
  phone: string;
  email: string;
  whatsapp?: string;
}

export interface PropertyFilters {
  type?: PropertyType;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  location?: string;
  city?: string;
  state?: string;
  amenities?: string[];
  features?: string[];
  isVerified?: boolean;
  availability?: string;
}

export interface PropertySearchParams {
  query?: string;
  filters?: PropertyFilters;
  sortBy?: 'price' | 'rating' | 'date' | 'relevance';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface PropertyResponse {
  properties: Property[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface PropertyCreateRequest {
  title: string;
  description: string;
  price: number;
  location: string;
  address: string;
  city: string;
  state: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  bedrooms: number;
  bathrooms: number;
  area: number;
  type: PropertyType;
  features: string[];
  amenities: string[];
  availability: string;
  contactInfo: ContactInfo;
}

export interface PropertyUpdateRequest extends Partial<PropertyCreateRequest> {
  id: string;
}

export interface PropertyReview {
  id: string;
  propertyId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
  helpful: number;
}

export interface PropertyFavorite {
  id: string;
  propertyId: string;
  userId: string;
  createdAt: string;
}
