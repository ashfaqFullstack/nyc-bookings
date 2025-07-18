import { type NextRequest, NextResponse } from 'next/server';

// Temporarily disabled middleware for testing
export function middleware(request: NextRequest) {
  // Just pass through all requests without any checks
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Temporarily matching nothing
  ],
};
