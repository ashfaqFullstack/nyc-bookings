import { type NextRequest, NextResponse } from 'next/server';
import { sql, type UserWithoutPassword } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth-utils';

export async function GET(request: NextRequest) {
  try {
    // Get user from JWT token
    const tokenUser = getUserFromRequest(request);
    if (!tokenUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user from database
    const result = await sql`
      SELECT id, "firstName", "lastName", email, phone, role, "isVerified", "createdAt", "updatedAt"
      FROM users
      WHERE id = ${tokenUser.userId}
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const user = result[0] as UserWithoutPassword;

    return NextResponse.json({
      user
    });
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
