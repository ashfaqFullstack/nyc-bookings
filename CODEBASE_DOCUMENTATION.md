# Airbnb Clone - Comprehensive Codebase Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Directory Structure](#directory-structure)
3. [Core Technologies](#core-technologies)
4. [Key Features](#key-features)
5. [Code Architecture](#code-architecture)
6. [Database Schema](#database-schema)
7. [API Routes](#api-routes)
8. [Components Guide](#components-guide)
9. [State Management](#state-management)
10. [Authentication Flow](#authentication-flow)
11. [Property Management](#property-management)
12. [Deployment](#deployment)
13. [Common Patterns](#common-patterns)
14. [Troubleshooting](#troubleshooting)

## Project Overview

This is a Next.js 15 Airbnb clone with full property management, user authentication, and booking integration via Hostex widgets. The project is built with TypeScript and uses Neon PostgreSQL for data persistence.

### Key Features
- User authentication (login, register, password reset)
- Property browsing and search
- Wishlist functionality
- Admin panel for property management
- Mobile-responsive design
- Hostex booking widget integration
- Real-time data updates

## Directory Structure

```
airbnb-clone/
├── src/
│   ├── app/                      # Next.js app directory
│   │   ├── api/                  # API routes
│   │   │   ├── auth/             # Authentication endpoints
│   │   │   ├── admin/            # Admin-only endpoints
│   │   │   ├── properties/       # Public property endpoints
│   │   │   └── wishlist/         # Wishlist endpoints
│   │   ├── admin/                # Admin pages
│   │   │   ├── page.tsx          # Admin dashboard
│   │   │   └── properties/       # Property management
│   │   ├── property/             # Property pages
│   │   │   └── [id]/             # Dynamic property detail
│   │   ├── profile/              # User profile
│   │   ├── trips/                # User trips
│   │   ├── wishlist/             # User wishlist
│   │   ├── search/               # Search page
│   │   ├── layout.tsx            # Root layout
│   │   └── page.tsx              # Homepage
│   ├── components/               # Reusable components
│   │   ├── ui/                   # Base UI components (shadcn)
│   │   ├── auth/                 # Authentication modals
│   │   ├── header.tsx            # Site header
│   │   ├── footer.tsx            # Site footer
│   │   └── property-card.tsx     # Property listing card
│   ├── lib/                      # Utilities and contexts
│   │   ├── auth-context.tsx      # Authentication state
│   │   ├── wishlist-context.tsx  # Wishlist state
│   │   ├── data.ts               # Mock property data
│   │   ├── db.ts                 # Database connection
│   │   └── utils.ts              # Helper functions
│   ├── types/                    # TypeScript definitions
│   └── styles/                   # Global styles
├── public/                       # Static assets
├── netlify.toml                  # Netlify configuration
└── package.json                  # Dependencies
```

## Core Technologies

- **Frontend**: Next.js 15, React 18, TypeScript
- **Database**: Neon PostgreSQL
- **Styling**: Tailwind CSS + shadcn/ui
- **Authentication**: JWT + bcrypt
- **Package Manager**: Bun
- **Deployment**: Netlify
- **Booking Integration**: Hostex

## Key Features

### 1. User Authentication
- JWT-based authentication
- Secure password hashing with bcrypt
- Login/Register modals
- Password reset functionality
- Profile management

### 2. Property Management
- CRUD operations for properties
- Image management
- Amenity management
- Location/coordinate editing
- House rules and policies
- Review management

### 3. User Features
- Property browsing
- Wishlist functionality
- Search and filtering
- Booking via Hostex widget
- Trip management

### 4. Admin Panel
- Property CRUD operations
- Bulk property management
- Analytics dashboard (planned)
- User management (planned)

## Code Architecture

### Data Flow
```
User Action → Component → Context/API Call → Server Route → Database → Response → UI Update
```

### Component Hierarchy
```
Layout
├── Header
│   ├── Navigation
│   ├── UserMenu
│   └── AuthModals
├── Main Content
│   ├── PropertyGrid
│   │   └── PropertyCard
│   ├── PropertyDetail
│   │   ├── PhotoGallery
│   │   ├── HostInfo
│   │   ├── Amenities
│   │   └── BookingWidget
│   └── AdminPanel
│       ├── PropertyForm
│       └── PropertyList
└── Footer
```

## Database Schema

### Users Table
```sql
users (
  id SERIAL PRIMARY KEY,
  firstName VARCHAR(100) NOT NULL,
  lastName VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  passwordHash VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'user',
  isVerified BOOLEAN DEFAULT false,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

### Wishlists Table
```sql
wishlists (
  id SERIAL PRIMARY KEY,
  userId INTEGER REFERENCES users(id) ON DELETE CASCADE,
  propertyId VARCHAR(50) NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(userId, propertyId)
)
```

### Properties (Currently Mock Data)
Properties are stored in `src/lib/data.ts` as mock data but follow this structure:
```typescript
interface Property {
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
  amenities: string[];
  bedrooms: number;
  bathrooms: number;
  beds: number;
  guests: number;
  // ... more fields
}
```

## API Routes

### Authentication Routes

#### POST /api/auth/register
- Body: `{ firstName, lastName, email, password, phone }`
- Returns: `{ success, user, token }`

#### POST /api/auth/login
- Body: `{ email, password }`
- Returns: `{ success, user, token }`

#### GET /api/auth/me
- Headers: `Authorization: Bearer <token>`
- Returns: `{ user }`

#### PUT /api/auth/profile
- Headers: `Authorization: Bearer <token>`
- Body: Partial user data
- Returns: `{ success, user }`

### Wishlist Routes

#### GET /api/wishlist
- Headers: `Authorization: Bearer <token>`
- Returns: `{ wishlist: string[] }`

#### POST /api/wishlist
- Headers: `Authorization: Bearer <token>`
- Body: `{ propertyId }`
- Returns: `{ success, message }`

#### DELETE /api/wishlist
- Headers: `Authorization: Bearer <token>`
- Query: `?propertyId=<id>`
- Returns: `{ success, message }`

### Admin Routes

#### GET /api/admin/properties
- Headers: `Authorization: Bearer <token>`
- Query: `?page=1&limit=10`
- Returns: Paginated properties

#### POST /api/admin/properties
- Headers: `Authorization: Bearer <token>`
- Body: Property data
- Returns: `{ success, property }`

#### PUT /api/admin/properties/[id]
- Headers: `Authorization: Bearer <token>`
- Body: Updated property data
- Returns: `{ success, property }`

## Components Guide

### Core Components

#### PropertyCard
```typescript
interface PropertyCardProps {
  property: Property;
  onLoginRequired?: () => void;
}
```
Displays property thumbnail with key info and wishlist button.

#### Header
Main navigation with user menu, search, and auth modals.

#### HostexBookingWidget
```typescript
interface HostexBookingWidgetProps {
  listingId: string;
  widgetId: string;
}
```
Embeds Hostex booking functionality.

### UI Components (shadcn/ui)
- Button, Card, Dialog, Input, etc.
- Located in `src/components/ui/`
- Customizable via Tailwind classes

## State Management

### AuthContext
```typescript
interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (userData: SignupData) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (userData: Partial<User>) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}
```

### WishlistContext
```typescript
interface WishlistContextType {
  wishlist: string[];
  isLoading: boolean;
  addToWishlist: (propertyId: string) => Promise<boolean>;
  removeFromWishlist: (propertyId: string) => Promise<boolean>;
  isInWishlist: (propertyId: string) => boolean;
  refreshWishlist: () => Promise<void>;
}
```

## Authentication Flow

1. User clicks login/signup
2. Modal opens with form
3. Form submission calls auth context method
4. Context calls API route
5. API validates and returns JWT token
6. Token stored in localStorage
7. User state updated in context
8. UI reflects authenticated state

## Property Management

### Creating a Property (Admin)
1. Navigate to `/admin/properties/new`
2. Fill out multi-tab form
3. Submit creates new property
4. Redirects to property list

### Editing a Property (Admin)
1. Navigate to `/admin/properties/[id]`
2. Form pre-filled with existing data
3. Make changes and save
4. Updates reflected immediately

### Property Display
- Homepage: Featured carousel + grid
- Search page: Filtered results
- Detail page: Full property info + booking widget

## Deployment

### Netlify Configuration
```toml
[build]
  command = "bun run build"
  publish = "out"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200
```

### Environment Variables
```env
DATABASE_URL=<neon-connection-string>
JWT_SECRET=<secret-key>
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=<secret-key>
```

## Common Patterns

### Protected Routes
```typescript
// Client-side protection
useEffect(() => {
  if (!isLoggedIn) {
    router.push('/');
  }
}, [isLoggedIn]);

// Server-side protection
const token = request.headers.get('Authorization');
const user = await verifyToken(token);
if (!user || user.role !== 'admin') {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
```

### Error Handling
```typescript
try {
  // Operation
} catch (error) {
  console.error('Operation failed:', error);
  return { success: false, error: 'User-friendly message' };
}
```

### Loading States
```typescript
const [loading, setLoading] = useState(false);

const handleAction = async () => {
  setLoading(true);
  try {
    await performAction();
  } finally {
    setLoading(false);
  }
};
```

## Troubleshooting

### Common Issues

#### 1. Authentication Token Not Found
- Check localStorage for 'authToken'
- Verify token is being sent in headers
- Check token expiration

#### 2. Wishlist Not Updating
- Ensure user is authenticated
- Check network tab for API calls
- Verify property ID format

#### 3. Admin Routes Access Denied
- Confirm user role is 'admin'
- Check JWT token validity
- Verify middleware is running

#### 4. Property Images Not Loading
- Check image URLs are valid
- Verify CORS settings
- Check Next.js image domains config

### Debug Tips
1. Enable React DevTools
2. Check Network tab for API calls
3. Use console.log in contexts for state debugging
4. Check server logs for API errors
5. Verify environment variables are set

## Quick Reference

### Adding a New Page
1. Create file in `src/app/[route]/page.tsx`
2. Export default component
3. Add to navigation if needed

### Adding an API Route
1. Create file in `src/app/api/[route]/route.ts`
2. Export named functions (GET, POST, etc.)
3. Handle authentication if needed

### Adding a Component
1. Create file in `src/components/`
2. Export component
3. Add TypeScript props interface
4. Import and use in pages

### Modifying Styles
- Component-specific: Use Tailwind classes
- Global styles: Edit `src/app/globals.css`
- Theme colors: Update Tailwind config
