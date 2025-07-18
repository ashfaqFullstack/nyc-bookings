import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined');
}

export const sql = neon(process.env.DATABASE_URL);

export type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  passwordHash: string;
  role: 'user' | 'admin';
  isVerified: boolean;
  resetToken: string | null;
  resetTokenExpiry: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type Property = {
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
  coordinates: { lat: number; lng: number };
  neighborhoodInfo: {
    description: string;
    highlights: string[];
    walkScore: number;
    transitScore: number;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type Wishlist = {
  id: number;
  userId: number;
  propertyId: string;
  createdAt: Date;
};

export type UserWithoutPassword = Omit<User, 'passwordHash'>;
