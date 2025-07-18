import { type NextRequest, NextResponse } from 'next/server';
import { sql, type UserWithoutPassword, type User } from '@/lib/db';
import { getUserFromRequest, hashPassword, verifyPassword } from '@/lib/auth-utils';

export async function PUT(request: NextRequest) {
  try {
    // Get user from JWT token
    const tokenUser = getUserFromRequest(request);

    if (!tokenUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { firstName, lastName, email, phone, currentPassword, newPassword } = await request.json();

    // Validate required fields
    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        { error: 'First name, last name, and email are required' },
        { status: 400 }
      );
    }

    // If password change is requested, validate current password
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { error: 'Current password is required to change password' },
          { status: 400 }
        );
      }

      // Validate new password strength
      if (newPassword.length < 6) {
        return NextResponse.json(
          { error: 'New password must be at least 6 characters long' },
          { status: 400 }
        );
      }

      // Get current user with password hash to verify current password
      const userResult = await sql`
        SELECT "passwordHash" FROM users WHERE id = ${tokenUser.userId}
      `;

      if (userResult.length === 0) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }

      const currentUser = userResult[0] as { passwordHash: string };

      // Verify current password
      const isCurrentPasswordValid = await verifyPassword(currentPassword, currentUser.passwordHash);

      if (!isCurrentPasswordValid) {
        return NextResponse.json(
          { error: 'Current password is incorrect' },
          { status: 400 }
        );
      }

      // Hash new password
      const newPasswordHash = await hashPassword(newPassword);

      // Update user profile with new password
      const result = await sql`
        UPDATE users
        SET
          "firstName" = ${firstName},
          "lastName" = ${lastName},
          email = ${email},
          phone = ${phone || null},
          "passwordHash" = ${newPasswordHash},
          "updatedAt" = NOW()
        WHERE id = ${tokenUser.userId}
        RETURNING id, "firstName", "lastName", email, phone, "isVerified", "createdAt", "updatedAt"
      `;

      if (result.length === 0) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }

      const user = result[0] as UserWithoutPassword;
      return NextResponse.json({
        user,
        message: 'Profile and password updated successfully'
      });
    }

    // Update user profile without password change
    const result = await sql`
      UPDATE users
      SET
        "firstName" = ${firstName},
        "lastName" = ${lastName},
        email = ${email},
        phone = ${phone || null},
        "updatedAt" = NOW()
      WHERE id = ${tokenUser.userId}
      RETURNING id, "firstName", "lastName", email, phone, "isVerified", "createdAt", "updatedAt"
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const user = result[0] as UserWithoutPassword;

    return NextResponse.json({ user });

  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
