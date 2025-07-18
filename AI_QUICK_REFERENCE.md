# AI Quick Reference Guide

## 🚀 Quick Start Commands

```bash
# Start development server
bun run dev

# Run linter
bun run lint

# Build for production
bun run build
```

## 📁 Key File Locations

### User-Facing Pages
- Homepage: `src/app/page.tsx`
- Property Detail: `src/app/property/[id]/property-detail-client.tsx`
- Search: `src/app/search/page.tsx`
- Wishlist: `src/app/wishlist/page.tsx`
- Profile: `src/app/profile/page.tsx`

### Admin Pages
- Dashboard: `src/app/admin/page.tsx`
- Properties List: `src/app/admin/properties/page.tsx`
- New Property: `src/app/admin/properties/new/page.tsx`
- Edit Property: `src/app/admin/properties/[id]/page.tsx`

### API Routes
- Auth: `src/app/api/auth/*/route.ts`
- Wishlist: `src/app/api/wishlist/route.ts`
- Admin Properties: `src/app/api/admin/properties/*/route.ts`

### Core Components
- Header: `src/components/header.tsx`
- Property Card: `src/components/property-card.tsx`
- Auth Modals: `src/components/auth/*.tsx`
- UI Components: `src/components/ui/*.tsx`

### Contexts & Hooks
- Auth Context: `src/lib/auth-context.tsx`
- Wishlist Context: `src/lib/wishlist-context.tsx`
- Property Form Hook: `src/hooks/use-property-form.ts`

### Type Definitions
- Auth Types: `src/types/auth.ts`
- Property Types: `src/types/property.ts`

### Data
- Mock Properties: `src/lib/data.ts`
- Database Connection: `src/lib/db.ts`

## 🎯 Common Tasks

### Adding a New Page
1. Create `src/app/[route]/page.tsx`
2. Export default component
3. Add navigation link if needed

### Adding an API Route
1. Create `src/app/api/[route]/route.ts`
2. Export named functions (GET, POST, etc.)
3. Check authentication with `verifyToken()`

### Creating a Component
1. Create in `src/components/`
2. Add TypeScript interface for props
3. Use existing UI components from `src/components/ui/`

### Modifying Property Structure
1. Update type in `src/types/property.ts`
2. Update mock data in `src/lib/data.ts`
3. Update form sections in `src/components/admin/property-form-sections.tsx`

## 🔧 Architecture Patterns

### Authentication Flow
```typescript
// Client-side
const { user, isLoggedIn, login, logout } = useAuth();

// Server-side
const token = request.headers.get('Authorization');
const user = await verifyToken(token);
```

### Protected Routes
```typescript
// Client protection
useEffect(() => {
  if (!isLoggedIn || user?.role !== 'admin') {
    router.push('/');
  }
}, [isLoggedIn, user]);

// API protection
if (!user || user.role !== 'admin') {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
```

### Form Handling
```typescript
// Use the property form hook
const { property, updateProperty, saveProperty } = usePropertyForm();

// Update field
updateProperty('title', newValue);

// Update nested field
updateNestedProperty('coordinates', 'lat', newValue);
```

## ⚠️ Common Pitfalls

### 1. Array Index Keys
❌ Don't use array index as key:
```typescript
{items.map((item, index) => <div key={index}>...</div>)}
```

✅ Use unique identifiers:
```typescript
{items.map((item) => <div key={item.id}>...</div>)}
// or
{items.map((item, index) => <div key={`${item.name}-${index}`}>...</div>)}
```

### 2. Exhaustive Dependencies
❌ Missing dependencies:
```typescript
useEffect(() => {
  fetchData(id);
}, []); // Missing 'id'
```

✅ Include all dependencies:
```typescript
useEffect(() => {
  fetchData(id);
}, [id]);
```

### 3. Unnecessary Else
❌ Else after return:
```typescript
if (condition) {
  return x;
} else {
  return y;
}
```

✅ Direct return:
```typescript
if (condition) {
  return x;
}
return y;
```

### 4. Self-closing Tags
❌ Empty divs:
```typescript
<div></div>
```

✅ Self-closing:
```typescript
<div />
```

## 🔍 Debugging Tips

### Check Authentication
```typescript
// In component
console.log('Auth state:', { user, isLoggedIn, isLoading });

// In API route
console.log('Token:', request.headers.get('Authorization'));
```

### Check Wishlist
```typescript
// In component
const { wishlist, isInWishlist } = useWishlist();
console.log('Wishlist:', wishlist);
console.log('Is in wishlist:', isInWishlist(propertyId));
```

### API Debugging
```typescript
// Check request
console.log('Method:', request.method);
console.log('Body:', await request.json());

// Check response
console.log('Response status:', response.status);
console.log('Response data:', data);
```

## 📝 Quick Fixes

### Linting Errors
```bash
# Auto-fix most issues
bun run lint --fix

# Check specific file
bunx eslint src/app/page.tsx
```

### Type Errors
```bash
# Check TypeScript
bunx tsc --noEmit

# Check specific file
bunx tsc --noEmit src/app/page.tsx
```

### Build Errors
```bash
# Clear cache and rebuild
rm -rf .next
bun run build
```

## 🚨 Emergency Commands

```bash
# Kill dev server
lsof -ti:3001 | xargs kill

# Reset dependencies
rm -rf node_modules bun.lock
bun install

# Reset database connection
# Check .env.local for DATABASE_URL
```

## 📊 Project Stats
- Framework: Next.js 15
- UI Library: shadcn/ui + Tailwind CSS
- Database: Neon PostgreSQL
- Auth: JWT + bcrypt
- Package Manager: Bun
- Deployment: Netlify
