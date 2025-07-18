# Airbnb Clone - NYC Vacation Rentals

A full-stack Airbnb clone built with Next.js 15, TypeScript, and Neon PostgreSQL. Features property listings, user authentication, wishlist functionality, and admin property management.

## 📚 Documentation

- [Comprehensive Codebase Documentation](./CODEBASE_DOCUMENTATION.md) - Complete guide to the codebase structure
- [AI Quick Reference](./AI_QUICK_REFERENCE.md) - Quick commands and common patterns for AI assistance
- [API Documentation](./API_DOCUMENTATION.md) - Detailed API endpoint reference
- [State Management Guide](./STATE_MANAGEMENT_GUIDE.md) - How to work with Auth and Wishlist contexts
- [Database Setup](./DATABASE_SETUP.md) - Database schema and setup instructions

## 🚀 Quick Start

```bash
# Install dependencies
bun install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your database credentials

# Run development server
bun run dev

# Open http://localhost:3001
```

## 🎯 Key Features

- **Property Browsing**: Browse NYC vacation rentals with filtering and search
- **User Authentication**: Secure login/signup with JWT tokens
- **Wishlist**: Save favorite properties (requires login)
- **Admin Panel**: Full CRUD operations for property management
- **Mobile Responsive**: Optimized for all devices
- **Booking Integration**: Hostex widget for real bookings

## 🛠 Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Database**: Neon PostgreSQL
- **Authentication**: JWT + bcrypt
- **Deployment**: Netlify
- **Package Manager**: Bun

## 📁 Project Structure

```
airbnb-clone/
├── src/
│   ├── app/              # Next.js app directory (pages + API)
│   ├── components/       # Reusable React components
│   ├── lib/              # Utilities, contexts, and data
│   ├── hooks/            # Custom React hooks
│   ├── types/            # TypeScript type definitions
│   └── styles/           # Global styles
├── public/               # Static assets
└── docs/                 # Additional documentation
```

## 🔑 Environment Variables

Create a `.env.local` file with:

```env
# Database
DATABASE_URL=postgresql://user:password@host/database

# Authentication
JWT_SECRET=your-secret-key-here

# Next.js
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=your-nextauth-secret
```

## 👤 User Roles

### Regular Users
- Browse properties
- Create account
- Save to wishlist
- View trip history
- Update profile

### Admin Users
- All regular user features
- Access admin dashboard
- Create/edit/delete properties
- Manage property details
- View analytics (coming soon)

## 🧪 Testing the Application

1. **Create a user account**: Click "Sign up" in the header
2. **Browse properties**: Explore the homepage and search
3. **Save properties**: Click the heart icon (requires login)
4. **Admin access**: Set user role to 'admin' in database
5. **Manage properties**: Visit `/admin` when logged in as admin

## 🚧 Development

### Common Commands

```bash
# Development
bun run dev

# Linting
bun run lint
bun run lint:fix

# Type checking
bunx tsc --noEmit

# Build for production
bun run build

# Clean build
rm -rf .next && bun run build
```

### Adding New Features

1. **New Page**: Create in `src/app/[route]/page.tsx`
2. **API Route**: Create in `src/app/api/[route]/route.ts`
3. **Component**: Create in `src/components/`
4. **Admin Feature**: Add to `src/app/admin/`

See [AI Quick Reference](./AI_QUICK_REFERENCE.md) for detailed patterns.

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   lsof -ti:3001 | xargs kill
   ```

2. **Database connection errors**
   - Check DATABASE_URL in .env.local
   - Verify Neon database is active

3. **Authentication not working**
   - Check JWT_SECRET is set
   - Clear localStorage and try again

4. **Build errors**
   ```bash
   rm -rf .next node_modules
   bun install
   bun run build
   ```

## 📝 Project Status

### ✅ Completed
- User authentication system
- Property listing and details
- Wishlist functionality
- Admin property management
- Mobile responsive design
- Search and filtering

### 🚧 In Progress
- Email verification
- Password reset
- Property analytics
- Advanced search filters

### 📋 Planned
- Booking management
- Review system
- Host dashboard
- Payment integration
- Real-time notifications

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run linting and tests
5. Submit a pull request

## 📄 License

This project is for educational purposes. See [LICENSE](./LICENSE) for details.

## 🙏 Acknowledgments

- Design inspired by Airbnb
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Booking widget by [Hostex](https://hostex.com)
- Database by [Neon](https://neon.tech)
