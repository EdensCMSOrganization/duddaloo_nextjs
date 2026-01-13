// lib/auth.ts
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev';
export const SESSION_COOKIE_NAME = 'admin_session';

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

// Changed to async because cookies() is a promise
export async function setAuthCookie(userId: string): Promise<void> {
  const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });

  const cookieStore = await cookies(); // <--- IMPORTANT: await here

  cookieStore.set({
    name: SESSION_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax', // Recommended to add this
    maxAge: 7 * 24 * 60 * 60,
    path: '/',
  });
}

// Changed to async
export async function getAuthUser(): Promise<{ userId: string } | null> {
  const cookieStore = await cookies(); // <--- IMPORTANT: await here
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    return decoded;
  } catch {
    return null;
  }
}

// Changed to async
export async function requireAuth(): Promise<string> {
  const user = await getAuthUser();
  if (!user) {
    throw new Error('Unauthorized');
  }
  return user.userId;
}

// In API Routes or Middleware, req.cookies remains synchronous (Request object)
export function getAuthUserFromRequest(req: NextRequest): { userId: string } | null {
  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string };
  } catch {
    return null;
  }
}
