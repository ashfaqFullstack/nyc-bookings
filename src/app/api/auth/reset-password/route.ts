import { type NextRequest, NextResponse } from 'next/server';
import { sql, type UserWithoutPassword } from '@/lib/db';
import { hashPassword, isResetTokenValid } from '@/lib/auth-utils';

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json();
    console.log('Reset password request with token:', token ? `${token.substring(0, 8)}...` : 'No token');

    // Validate required fields
    if (!token || !password) {
      return NextResponse.json(
        { error: 'Token and password are required' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Find user by reset token
    const userResult = await sql`
      SELECT id, "firstName", "lastName", email, "resetToken", "resetTokenExpiry"
      FROM users
      WHERE "resetToken" = ${token}
    `;

    if (userResult.length === 0) {
      return NextResponse.json(
        { error: 'Invalid or expired reset token' },
        { status: 400 }
      );
    }

    const user = userResult[0];
    console.log('Found user for reset:', user.id, 'Token expiry:', user.resetTokenExpiry);

    // Check if token is still valid
    if (!isResetTokenValid(user.resetTokenExpiry)) {
      console.log('Reset token expired for user:', user.id);
      return NextResponse.json(
        { error: 'Reset token has expired' },
        { status: 400 }
      );
    }

    // Hash new password
    const passwordHash = await hashPassword(password);
    console.log('Password hashed successfully for user:', user.id);

    // Update user password and clear reset token
    const updateResult = await sql`
      UPDATE users
      SET
        "passwordHash" = ${passwordHash},
        "resetToken" = NULL,
        "resetTokenExpiry" = NULL,
        "updatedAt" = NOW()
      WHERE id = ${user.id}
      RETURNING id, "firstName", "lastName", email, "isVerified", "createdAt", "updatedAt"
    `;

    if (updateResult.length === 0) {
      return NextResponse.json(
        { error: 'Failed to update password' },
        { status: 500 }
      );
    }

    const updatedUser = updateResult[0] as UserWithoutPassword;
    console.log('Password reset successful for user:', updatedUser.id);

    return NextResponse.json({
      message: 'Password reset successful',
      user: updatedUser
    });

  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
