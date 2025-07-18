export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  role: 'user' | 'admin';
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserWithPassword extends User {
  passwordHash: string;
}

export interface SignupData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface WishlistItem {
  id: number;
  userId: number;
  propertyId: string;
  createdAt: Date;
}

export interface ApiError {
  error: string;
}

export interface Property {
  id: string;
  title: string;
  location: string;
  neighborhood: string;
  price: number;
  rating: number;
  reviewCount: number;
  images: string[];
  host: string;
  hostImage: string;
  hostJoinedDate: string;
  amenities: string[];
  description: string;
  bedrooms: number;
  bathrooms: number;
  beds: number;
  guests: number;
  checkIn: string;
  checkOut: string;
  houseRules: string[];
  cancellationPolicy: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  neighborhoodInfo: {
    description: string;
    highlights: string[];
    walkScore: number;
    transitScore: number;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePropertyData {
  title: string;
  location: string;
  neighborhood: string;
  price: number;
  images: string[];
  host: string;
  hostImage: string;
  amenities: string[];
  description: string;
  bedrooms: number;
  bathrooms: number;
  beds: number;
  guests: number;
  checkIn: string;
  checkOut: string;
  houseRules: string[];
  cancellationPolicy: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  neighborhoodInfo: {
    description: string;
    highlights: string[];
    walkScore: number;
    transitScore: number;
  };
}
