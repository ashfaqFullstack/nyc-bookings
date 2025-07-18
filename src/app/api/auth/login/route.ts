import { type NextRequest, NextResponse } from 'next/server';
import { sql, type User, UserWithoutPassword } from '@/lib/db';
import { verifyPassword, generateToken } from '@/lib/auth-utils';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    console.log('Login attempt:', { email, passwordLength: password?.length });

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user by email
    const result = await sql`
      SELECT id, "firstName", "lastName", email, phone, "passwordHash", role, "isVerified", "createdAt", "updatedAt"
      FROM users
      WHERE email = ${email}
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const user = result[0] as User;
    console.log('User found:', { id: user.id, email: user.email, hasPasswordHash: !!user.passwordHash });

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.passwordHash);
    console.log('Password verification result:', isPasswordValid);

    if (!isPasswordValid) {
      console.log('Password verification failed for user:', user.email);
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Remove password from user object
    const { passwordHash, ...userWithoutPassword } = user;

    // Generate JWT token
    const token = generateToken(userWithoutPassword);

    return NextResponse.json({
      user: userWithoutPassword,
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
