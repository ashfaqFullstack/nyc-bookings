import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth-utils';

export interface AdminAuthResult {
  status: number;
  error?: string;
  user?: {
    userId: number;
    email: string;
    role: 'user' | 'admin';
  };
}

export async function verifyAdminToken(request: NextRequest): Promise<AdminAuthResult> {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return { status: 401, error: 'No token provided' };
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded) {
      return { status: 401, error: 'Invalid token' };
    }

    if (decoded.role !== 'admin') {
      return { status: 403, error: 'Admin access required' };
    }

    return { status: 200, user: decoded };
  } catch (error) {
    console.error('Token verification error:', error);
    return { status: 401, error: 'Invalid token' };
  }
}

export function createAdminResponse(message: string, status: number, data?: Record<string, unknown>) {
  const response: Record<string, unknown> = { message };
  if (data) {
    response.data = data;
  }
  if (status >= 400) {
    response.error = message;
  }
  return NextResponse.json(response, { status });
}
