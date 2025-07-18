# Project Context

This document provides a summary of the project's technical details, conventions, and structure.

## Project Overview

**Name:** Airbnb Clone - NYC Vacation Rentals
**Type:** Full-stack web application
**Framework:** Next.js 15 with App Router
**Database:** Neon PostgreSQL
**Deployment:** Netlify

## Recent Reorganization (Version 91+)

The codebase has been reorganized to improve efficiency and reduce redundancy:

### New Additions
1. **Shared Property Form Components** (`src/components/admin/property-form-sections.tsx`)
   - Reusable form sections for creating/editing properties
   - Eliminates duplicate code between new and edit pages

2. **Custom Hooks** (`src/hooks/use-property-form.ts`)
   - Centralizes property form logic
   - Handles saving, loading, and validation

3. **Type Definitions** (`src/types/property.ts`)
   - Comprehensive property type definitions
   - Constants for amenities, policies, etc.

4. **Documentation Suite**
   - `CODEBASE_DOCUMENTATION.md` - Comprehensive guide
   - `AI_QUICK_REFERENCE.md` - Quick AI navigation
   - `API_DOCUMENTATION.md` - API endpoint reference
   - `STATE_MANAGEMENT_GUIDE.md` - Context usage guide

## Naming Conventions

- **Components:** PascalCase (e.g., `PropertyCard.tsx`)
- **Pages:** kebab-case (e.g., `property-detail-client.tsx`)
- **API Routes:** kebab-case (e.g., `reset-password`)
- **Hooks:** camelCase with 'use' prefix (e.g., `usePropertyForm`)
- **Types:** PascalCase (e.g., `PropertyFormData`)
- **Constants:** UPPER_SNAKE_CASE (e.g., `COMMON_AMENITIES`)
- **Variables:** camelCase (e.g., `propertyId`)
- **Database Tables:** snake_case (e.g., `property_bookings`)
- **Database Columns:** snake_case (e.g., `user_id`)

## Core Dependencies

- **next**: 15.x - React framework
- **react**: 18.x - UI library
- **typescript**: 5.x - Type safety
- **tailwindcss**: 3.x - Utility CSS
- **@radix-ui/***: UI primitives for shadcn/ui
- **@neondatabase/serverless**: Database driver
- **jsonwebtoken**: JWT authentication
- **bcrypt**: Password hashing
- **lucide-react**: Icon library

## Architecture Patterns

### Component Structure
```
components/
├── ui/                    # Base UI components (shadcn)
├── admin/                 # Admin-specific components
│   └── property-form-sections.tsx
├── auth/                  # Authentication components
├── property-card.tsx      # Feature components
└── header.tsx            # Layout components
```

### State Management
- **Global State**: React Context (Auth, Wishlist)
- **Form State**: Custom hooks (usePropertyForm)
- **Server State**: API routes with fetch

### Data Flow
1. User Action → Component
2. Component → Hook/Context
3. Hook/Context → API Call
4. API → Database
5. Response → State Update
6. State → UI Re-render

## Key Features Implementation

### Authentication
- JWT tokens stored in localStorage
- Context provider wraps entire app
- Protected routes check auth state
- Admin role for property management

### Property Management
- Mock data in `src/lib/data.ts`
- Admin CRUD operations via API
- Shared form components for consistency
- Image management with URL inputs

### Wishlist
- Stored in PostgreSQL
- Optimistic UI updates
- Syncs on login/logout
- Per-user isolation

## Common Patterns

### Protected Routes
```typescript
useEffect(() => {
  if (!isLoggedIn || user?.role !== 'admin') {
    router.push('/');
  }
}, [isLoggedIn, user]);
```

### API Calls
```typescript
const response = await fetch('/api/endpoint', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify(data)
});
```

### Form Handling
```typescript
const { property, updateProperty, saveProperty } = usePropertyForm();
```

## File Directory Structure

```
src/
├── app/                   # Pages and API routes
│   ├── api/              # API endpoints
│   ├── admin/            # Admin pages
│   ├── property/         # Property pages
│   └── (auth pages)      # Login, profile, etc.
├── components/           # Reusable components
│   ├── ui/              # shadcn/ui components
│   └── admin/           # Admin components
├── hooks/               # Custom React hooks
├── lib/                 # Utilities and contexts
├── types/               # TypeScript types
└── styles/              # Global styles
```

## Environment Configuration

Required variables in `.env.local`:
- `DATABASE_URL` - Neon PostgreSQL connection
- `JWT_SECRET` - Token signing secret
- `NEXTAUTH_URL` - App URL
- `NEXTAUTH_SECRET` - NextAuth secret

## Performance Optimizations

1. **Image Optimization**: Next.js Image component
2. **Code Splitting**: Automatic with App Router
3. **Static Generation**: Property pages pre-rendered
4. **Client Components**: Only where needed
5. **Parallel Tool Calls**: For AI efficiency

## Security Measures

1. **Password Hashing**: bcrypt with salt rounds
2. **JWT Tokens**: Secure authentication
3. **Input Validation**: On both client and server
4. **SQL Injection Prevention**: Parameterized queries
5. **CORS**: Configured for API routes

## Debugging Tips

1. **Check Auth State**: `console.log(useAuth())`
2. **Verify Token**: `localStorage.getItem('authToken')`
3. **API Errors**: Check Network tab
4. **Type Errors**: Run `bunx tsc --noEmit`
5. **Lint Issues**: Run `bun run lint`

## Future Enhancements

- [ ] Real property data integration
- [ ] Payment processing
- [ ] Email notifications
- [ ] Advanced search filters
- [ ] Host dashboard
- [ ] Review system
- [ ] Booking management
