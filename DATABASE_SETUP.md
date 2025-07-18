# Airbnb Clone Database Setup

This project now includes a complete database solution using Neon PostgreSQL with real authentication and wishlist functionality.

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  firstName VARCHAR(100) NOT NULL,
  lastName VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  passwordHash VARCHAR(255) NOT NULL,
  isVerified BOOLEAN DEFAULT false,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Wishlists Table
```sql
CREATE TABLE wishlists (
  id SERIAL PRIMARY KEY,
  userId INTEGER REFERENCES users(id) ON DELETE CASCADE,
  propertyId VARCHAR(50) NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(userId, propertyId)
);
```

## Environment Variables

Make sure you have the following environment variables set in your `.env.local` file:

```env
# Database
DATABASE_URL=your_neon_database_connection_string

# JWT Secret (use a strong random secret in production)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Next.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-change-this-in-production
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile

### Wishlist
- `GET /api/wishlist` - Get user's wishlist
- `POST /api/wishlist` - Add property to wishlist
- `DELETE /api/wishlist?propertyId=<id>` - Remove property from wishlist

## Features Implemented

### Authentication
- ✅ User registration with email and password
- ✅ User login with JWT tokens
- ✅ Password hashing using bcrypt
- ✅ Profile management
- ✅ Session persistence using localStorage
- ✅ Authentication middleware for protected routes

### Wishlist
- ✅ Add/remove properties to/from wishlist
- ✅ Persistent wishlist data in database
- ✅ Real-time wishlist updates in UI
- ✅ Wishlist page showing saved properties

### Security
- ✅ Password hashing with bcrypt
- ✅ JWT token authentication
- ✅ Input validation
- ✅ SQL injection protection using parameterized queries
- ✅ Authentication middleware

## Usage

1. **Registration**: Users can create accounts with email and password
2. **Login**: Users can login and receive a JWT token
3. **Wishlist**: Authenticated users can save properties to their wishlist
4. **Profile**: Users can update their profile information

## Testing

To test the implementation:

1. Start the development server: `bun run dev`
2. Open http://localhost:3001
3. Create a new account using the signup modal
4. Login with your credentials
5. Browse properties and add them to your wishlist
6. Visit the wishlist page to see saved properties

## Database Connection

The project is connected to Neon PostgreSQL with project ID: `nameless-dawn-65547505`

Connection string is stored in `.env.local` file for security.

## Technical Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Database**: Neon PostgreSQL
- **Authentication**: JWT tokens, bcrypt for password hashing
- **Database Client**: @neondatabase/serverless
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React Context for auth and wishlist state

## File Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── register/route.ts
│   │   │   ├── login/route.ts
│   │   │   ├── me/route.ts
│   │   │   └── profile/route.ts
│   │   └── wishlist/route.ts
│   ├── wishlist/page.tsx
│   └── ...
├── lib/
│   ├── auth-context.tsx
│   ├── wishlist-context.tsx
│   ├── auth-utils.ts
│   └── db.ts
├── types/
│   └── auth.ts
└── middleware.ts
```

## Next Steps

- Add email verification functionality
- Implement password reset
- Add user profile pictures
- Add booking functionality
- Add review system
- Implement search and filtering
