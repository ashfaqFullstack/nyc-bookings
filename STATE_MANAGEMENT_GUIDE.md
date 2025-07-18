# State Management Guide

## Overview

This application uses React Context API for global state management. There are two main contexts:
1. **AuthContext** - Manages user authentication state
2. **WishlistContext** - Manages user's saved properties

## AuthContext

### Location
`src/lib/auth-context.tsx`

### What it manages
- User authentication state
- Login/logout functionality
- User profile updates
- JWT token management

### How to use

#### In Components
```typescript
import { useAuth } from '@/lib/auth-context';

export function MyComponent() {
  const {
    user,           // Current user object or null
    isLoggedIn,     // Boolean authentication status
    isLoading,      // Loading state
    login,          // Login function
    signup,         // Signup function
    logout,         // Logout function
    updateProfile   // Update profile function
  } = useAuth();

  // Example: Check if user is admin
  const isAdmin = user?.role === 'admin';

  // Example: Login
  const handleLogin = async () => {
    const result = await login(email, password);
    if (result.success) {
      console.log('Logged in successfully');
    } else {
      console.error('Login failed:', result.error);
    }
  };

  // Example: Conditional rendering
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isLoggedIn) {
    return <div>Please log in</div>;
  }

  return <div>Welcome, {user.firstName}!</div>;
}
```

### User Object Structure
```typescript
interface User {
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
```

### Authentication Flow
1. User submits login form
2. `login()` function called
3. API validates credentials
4. JWT token returned and stored in localStorage
5. User state updated in context
6. Components re-render with authenticated state

## WishlistContext

### Location
`src/lib/wishlist-context.tsx`

### What it manages
- User's saved properties (wishlist)
- Add/remove operations
- Sync with backend

### How to use

#### In Components
```typescript
import { useWishlist } from '@/lib/wishlist-context';

export function PropertyCard({ property }) {
  const {
    wishlist,           // Array of property IDs
    isLoading,          // Loading state
    addToWishlist,      // Add function
    removeFromWishlist, // Remove function
    isInWishlist,       // Check function
    refreshWishlist     // Refresh function
  } = useWishlist();

  const isSaved = isInWishlist(property.id);

  const handleToggleWishlist = async () => {
    if (isSaved) {
      await removeFromWishlist(property.id);
    } else {
      await addToWishlist(property.id);
    }
  };

  return (
    <button onClick={handleToggleWishlist}>
      {isSaved ? 'Saved' : 'Save'}
    </button>
  );
}
```

### Wishlist Behavior
- Automatically loads when user logs in
- Clears when user logs out
- Persists in database
- Updates optimistically (UI updates before API confirms)

## Common Patterns

### Protected Components
```typescript
export function AdminComponent() {
  const { user, isLoggedIn, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!isLoggedIn || user?.role !== 'admin')) {
      router.push('/');
    }
  }, [isLoading, isLoggedIn, user, router]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isLoggedIn || user?.role !== 'admin') {
    return null;
  }

  return <div>Admin content here</div>;
}
```

### Login Required Actions
```typescript
export function SaveButton({ propertyId }) {
  const { isLoggedIn } = useAuth();
  const { addToWishlist } = useWishlist();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleSave = async () => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }

    await addToWishlist(propertyId);
  };

  return (
    <>
      <button onClick={handleSave}>Save</button>
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </>
  );
}
```

### Loading States
```typescript
export function UserProfile() {
  const { user, isLoading: authLoading } = useAuth();
  const { wishlist, isLoading: wishlistLoading } = useWishlist();

  if (authLoading || wishlistLoading) {
    return <Skeleton />;
  }

  return (
    <div>
      <h1>{user.firstName}'s Profile</h1>
      <p>Saved properties: {wishlist.length}</p>
    </div>
  );
}
```

## State Debugging

### Check Auth State
```typescript
// In component
const auth = useAuth();
console.log('Auth state:', {
  user: auth.user,
  isLoggedIn: auth.isLoggedIn,
  isLoading: auth.isLoading
});
```

### Check Wishlist State
```typescript
// In component
const wishlist = useWishlist();
console.log('Wishlist state:', {
  items: wishlist.wishlist,
  count: wishlist.wishlist.length,
  isLoading: wishlist.isLoading
});
```

### Check Token
```typescript
// In browser console
localStorage.getItem('authToken')
```

## Best Practices

### 1. Always Check Loading State
```typescript
if (isLoading) {
  return <LoadingComponent />;
}
```

### 2. Handle Errors Gracefully
```typescript
const handleAction = async () => {
  const result = await login(email, password);
  if (!result.success) {
    setError(result.error || 'Something went wrong');
  }
};
```

### 3. Use Optimistic Updates
The wishlist already implements this - UI updates immediately while API call happens in background.

### 4. Don't Store Sensitive Data
Never store passwords or sensitive information in context state.

### 5. Clean Up Effects
```typescript
useEffect(() => {
  let mounted = true;

  const loadData = async () => {
    const data = await fetchData();
    if (mounted) {
      setData(data);
    }
  };

  loadData();

  return () => {
    mounted = false;
  };
}, []);
```

## Troubleshooting

### User Not Updating
1. Check if token is valid: `localStorage.getItem('authToken')`
2. Check network tab for API calls
3. Verify context is wrapped around component tree

### Wishlist Not Syncing
1. Ensure user is logged in
2. Check for API errors in network tab
3. Try manual refresh: `refreshWishlist()`

### Context Not Available
Error: "useAuth must be used within an AuthProvider"
- Ensure component is inside the provider in layout.tsx
- Check import path is correct

### State Not Persisting
- Auth token stored in localStorage
- Check if localStorage is available
- Verify token expiration
