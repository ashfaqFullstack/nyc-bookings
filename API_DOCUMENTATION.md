# API Documentation

## Base URL
- Development: `http://localhost:3001/api`
- Production: `https://yourdomain.com/api`

## Authentication
Most endpoints require authentication via JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Endpoints

### Authentication Endpoints

#### POST /api/auth/register
Create a new user account.

**Request Body:**
```json
{
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "password": "string",
  "phone": "string"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "phone": "string",
    "role": "user",
    "isVerified": false
  },
  "token": "jwt_token_here"
}
```

**Errors:**
- 400: Invalid input data
- 409: Email already exists

#### POST /api/auth/login
Authenticate user and get token.

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "role": "user"
  },
  "token": "jwt_token_here"
}
```

**Errors:**
- 401: Invalid credentials
- 400: Missing email or password

#### GET /api/auth/me
Get current authenticated user.

**Headers Required:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "user": {
    "id": 1,
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "phone": "string",
    "role": "user",
    "isVerified": false
  }
}
```

**Errors:**
- 401: Unauthorized (invalid/missing token)

#### PUT /api/auth/profile
Update user profile.

**Headers Required:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "firstName": "string",
  "lastName": "string",
  "phone": "string",
  "currentPassword": "string", // Required for password change
  "newPassword": "string" // Optional
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    // Updated user object
  }
}
```

**Errors:**
- 401: Unauthorized
- 400: Invalid current password

### Wishlist Endpoints

#### GET /api/wishlist
Get user's wishlist.

**Headers Required:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "wishlist": ["property_id_1", "property_id_2"]
}
```

#### POST /api/wishlist
Add property to wishlist.

**Headers Required:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "propertyId": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Property added to wishlist"
}
```

**Errors:**
- 409: Property already in wishlist
- 400: Missing propertyId

#### DELETE /api/wishlist?propertyId=<id>
Remove property from wishlist.

**Headers Required:** `Authorization: Bearer <token>`

**Query Parameters:**
- `propertyId`: Property ID to remove

**Response:**
```json
{
  "success": true,
  "message": "Property removed from wishlist"
}
```

**Errors:**
- 404: Property not in wishlist
- 400: Missing propertyId

### Property Endpoints

#### GET /api/properties
Get all public properties.

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)
- `location`: Filter by location
- `minPrice`: Minimum price filter
- `maxPrice`: Maximum price filter
- `bedrooms`: Number of bedrooms
- `guests`: Number of guests

**Response:**
```json
{
  "data": {
    "properties": [
      {
        "id": "string",
        "title": "string",
        "location": "string",
        "price": 100,
        "rating": 4.5,
        "reviewCount": 10,
        "images": ["url1", "url2"],
        // ... other property fields
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "totalPages": 5
    }
  }
}
```

### Admin Endpoints

All admin endpoints require authentication with admin role.

#### GET /api/admin/properties
Get all properties (admin view).

**Headers Required:** `Authorization: Bearer <token>` (admin role)

**Query Parameters:**
- Same as public properties endpoint
- `isActive`: Filter by active status

**Response:** Same structure as public endpoint with additional admin fields.

#### POST /api/admin/properties
Create new property.

**Headers Required:** `Authorization: Bearer <token>` (admin role)

**Request Body:**
```json
{
  "title": "string",
  "location": "string",
  "neighborhood": "string",
  "price": 100,
  "images": ["url1", "url2"],
  "description": "string",
  "bedrooms": 2,
  "bathrooms": 1,
  "beds": 2,
  "guests": 4,
  "amenities": ["WiFi", "Kitchen"],
  "houseRules": ["No smoking"],
  "coordinates": {
    "lat": 40.7589,
    "lng": -73.9851
  },
  // ... other property fields
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "property": {
      // Created property object
    }
  }
}
```

#### GET /api/admin/properties/[id]
Get single property details.

**Headers Required:** `Authorization: Bearer <token>` (admin role)

**Response:**
```json
{
  "data": {
    "property": {
      // Full property object
    }
  }
}
```

**Errors:**
- 404: Property not found

#### PUT /api/admin/properties/[id]
Update property.

**Headers Required:** `Authorization: Bearer <token>` (admin role)

**Request Body:** Same as create, all fields optional

**Response:**
```json
{
  "success": true,
  "data": {
    "property": {
      // Updated property object
    }
  }
}
```

#### DELETE /api/admin/properties/[id]
Delete property.

**Headers Required:** `Authorization: Bearer <token>` (admin role)

**Response:**
```json
{
  "success": true,
  "message": "Property deleted successfully"
}
```

## Error Response Format

All error responses follow this format:
```json
{
  "error": "Error message here",
  "code": "ERROR_CODE" // Optional
}
```

## Common Error Codes
- `UNAUTHORIZED`: Missing or invalid authentication
- `FORBIDDEN`: Insufficient permissions
- `NOT_FOUND`: Resource not found
- `VALIDATION_ERROR`: Invalid input data
- `DUPLICATE_ENTRY`: Resource already exists
- `SERVER_ERROR`: Internal server error

## Rate Limiting
- Authentication endpoints: 5 requests per minute
- Other endpoints: 100 requests per minute

## Best Practices

### Request Headers
Always include:
```
Content-Type: application/json
Authorization: Bearer <token> // When required
```

### Error Handling
```typescript
try {
  const response = await fetch('/api/endpoint', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Request failed');
  }

  const result = await response.json();
  return result;
} catch (error) {
  console.error('API Error:', error);
  // Handle error appropriately
}
```

### Pagination
When dealing with lists, always check pagination:
```typescript
const { data } = await response.json();
const { properties, pagination } = data;

console.log(`Page ${pagination.page} of ${pagination.totalPages}`);
console.log(`Showing ${properties.length} of ${pagination.total} properties`);
```
