import { NextResponse } from 'next/server';
import { cookies } from 'next/headers'; // Importación nativa de Next.js
import connectDB from '@/lib/db';
import User from '@/models/User';
import { verifyPassword, JWT_SECRET, SESSION_COOKIE_NAME } from '@/lib/auth';
import jwt from 'jsonwebtoken';

export async function POST(request: Request) {
  await connectDB();

  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json({ error: 'Email y contraseña requeridos' }, { status: 400 });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json({ error: 'Credenciales incorrectas' }, { status: 401 });
  }

  const isValid = await verifyPassword(password, user.password);
  if (!isValid) {
    return NextResponse.json({ error: 'Credenciales incorrectas' }, { status: 401 });
  }

  // Solución al error de ESLint: Usar el import de arriba
  const token = jwt.sign(
    { userId: user._id.toString() }, 
    JWT_SECRET, 
    { expiresIn: '7d' }
  );

  // Solución al error de 'cookie': Usar el API nativo de Next.js
  const cookieStore = await cookies();
  
  cookieStore.set({
    name: SESSION_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60,
    path: '/',
    sameSite: 'lax',
  });

  return NextResponse.json({ success: true });
}