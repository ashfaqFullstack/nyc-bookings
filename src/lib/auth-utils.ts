import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type { UserWithoutPassword } from './db';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

if (!process.env.JWT_SECRET) {
  console.warn('JWT_SECRET environment variable is not set, using fallback');
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function generateToken(user: UserWithoutPassword): string {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function verifyToken(token: string): { userId: number; email: string; role: 'user' | 'admin' } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload & {
      userId: number;
      email: string;
      role: 'user' | 'admin'
    };
    return {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role
    };
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
}

export function getUserFromRequest(req: Request): { userId: number; email: string; role: 'user' | 'admin' } | null {
  const authHeader = req.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  return verifyToken(token);
}

export function generateResetToken(): string {
  // Generate a secure random token
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < 32; i++) {
    token += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return token;
}

export function generateResetTokenExpiry(): Date {
  // Token expires in 1 hour
  const expiry = new Date();
  expiry.setHours(expiry.getHours() + 1);
  return expiry;
}

export function isResetTokenValid(expiry: Date | null): boolean {
  if (!expiry) return false;
  return new Date() < new Date(expiry);
}
