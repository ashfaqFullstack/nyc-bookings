import { type NextRequest, NextResponse } from 'next/server';
import { sql, type UserWithoutPassword } from '@/lib/db';
import { hashPassword, generateToken } from '@/lib/auth-utils';

export async function POST(request: NextRequest) {
  try {
    const { firstName, lastName, email, password, phone } = await request.json();
    console.log('Registration attempt:', { firstName, lastName, email, phone, passwordLength: password?.length });

    // Validate required fields
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
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

    // Check if user already exists
    const existingUser = await sql`
      SELECT id FROM users WHERE email = ${email}
    `;

    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await hashPassword(password);
    console.log('Password hashed successfully, length:', passwordHash.length);

    // Create user
    const result = await sql`
      INSERT INTO users ("firstName", "lastName", email, phone, "passwordHash", "isVerified", "createdAt", "updatedAt")
      VALUES (${firstName}, ${lastName}, ${email}, ${phone || null}, ${passwordHash}, false, NOW(), NOW())
      RETURNING id, "firstName", "lastName", email, phone, "isVerified", "createdAt", "updatedAt"
    `;

    console.log('User created successfully:', result[0]);

    const user = result[0] as UserWithoutPassword;

    // Generate JWT token
    const token = generateToken(user);

    return NextResponse.json({
      user,
      token
    }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
