// Property type definitions

export interface PropertyImage {
  url: string;
  caption?: string;
  order?: number;
}

export interface PropertyReview {
  id: string;
  user: string;
  userImage: string;
  rating: number;
  comment: string;
  date: string;
  avatar?: string;
}

export interface PropertyCoordinates {
  lat: number;
  lng: number;
}

export interface NeighborhoodInfo {
  description: string;
  highlights: string[];
  walkScore: number;
  transitScore: number;
}

export interface Property {
  id: string;
  title: string;
  listing_id : string;
  location: string;
  neighborhood: string;
  price: number;
  rating: number;
  address: string;
  reviewCount: number;
  images: string[];
  host: string;
  hostImage: string;
  hostJoinedDate: string;
  amenities: string[];
  description: string;
  bedrooms: number;
  bedroombedtypes: {
    bedroomNumber: number;
    bedTypes: string[];
  }[];
  livingrooms: number;
  livingroombedtypes: {
    livingRoomNumber: number;
    bedTypes: string[];
  }[];
  bathrooms: number;
  beds: number;
  guests: number;
  checkIn: string;
  checkOut: string;
  houseRules: string[];
  cancellationPolicy: string;
  coordinates: PropertyCoordinates;
  neighborhoodInfo: NeighborhoodInfo;
  reviews: PropertyReview[];
  scriptsrc:string;
  hostexwidgetid:string;
  category?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface PropertyFormData extends Omit<Property, 'id' | 'createdAt' | 'updatedAt'> {
  id?: string;
}

export interface PropertyFilters {
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  guests?: number;
  amenities?: string[];
  location?: string;
  category?: string;
}

export interface PropertyListResponse {
  properties: Property[];
  total: number;
  page: number;
  limit: number;
}

// Common amenities for quick selection
export const COMMON_AMENITIES = [
  'WiFi',
  'Kitchen',
  'Parking',
  'TV',
  'Air conditioning',
  'Pool',
  'Hot tub',
  'Gym',
  'Washer',
  'Dryer',
  'Heating',
  'Workspace',
  'Breakfast',
  'Hair dryer',
  'Iron',
  'Elevator',
  'Pet friendly',
  'Smoke alarm',
  'Carbon monoxide alarm',
  'First aid kit',
  'Fire extinguisher',
  'Lock on bedroom door',
];

// Property categories
export const PROPERTY_CATEGORIES = [
  'Entire home',
  'Private room',
  'Shared room',
  'Hotel room',
  'Unique stays',
] as const;

// Cancellation policies
export const CANCELLATION_POLICIES = [
  'Flexible',
  'Moderate',
  'Strict',
  'Super strict 30 days',
  'Super strict 60 days',
] as const;

// Default property values for new properties
export const DEFAULT_PROPERTY: PropertyFormData = {
  title: '',
  location: '',
  listing_id: '',
  hostexwidgetid:'',
  scriptsrc:'',
  neighborhood: '',
  price: 0,
  rating: 0,
  reviewCount: 0,
  images: [],
  host: '',
  hostImage: '',
  hostJoinedDate: new Date().getFullYear().toString(),
  amenities: [],
  description: '',
    bedroombedtypes: [
  { bedroomNumber: 1, bedTypes: ['Queen'] }
  ],
   livingrooms: 1,
  livingroombedtypes: [
    { livingRoomNumber: 1, bedTypes: ['Sofa Bed'] }
  ],
  bedrooms: 1,
  address:'',
  bathrooms: 1,
  beds: 1,
  guests: 2,
  checkIn: '3:00 PM',
  checkOut: '11:00 AM',
  houseRules: [],
  cancellationPolicy: 'Moderate',
  coordinates: {
    lat: 40.7589,
    lng: -73.9851,
  },
  neighborhoodInfo: {
    description: '',
    highlights: [],
    walkScore: 0,
    transitScore: 0,
  },
  reviews: [],
  category: 'Entire home',
  isActive: true,
};
