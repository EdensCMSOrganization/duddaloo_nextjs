// app/api/auth/register/route.ts
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { hashPassword } from '@/lib/auth';

export async function POST(request: Request) {
  await connectDB();

  // Verificar si ya existe un admin (solo permitir uno)
  const existingUser = await User.findOne({});
  if (existingUser) {
    return NextResponse.json(
      { error: 'Ya existe un administrador. Elimina /register.' },
      { status: 400 }
    );
  }

  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json({ error: 'Email y contraseña requeridos' }, { status: 400 });
  }

  try {
    const hashedPassword = await hashPassword(password);
    await User.create({ email, password: hashedPassword });
    return NextResponse.json({ success: true });
  } catch (err: unknown) { // 1. Cambiamos 'any' por 'unknown'
    
    // 2. Comprobamos si el error es un objeto y tiene la propiedad 'code'
    if (err && typeof err === 'object' && 'code' in err) {
      if (err.code === 11000) {
        return NextResponse.json({ error: 'Email ya registrado' }, { status: 400 });
      }
    }

    // Error genérico si no es el código 11000 o es otro tipo de error
    console.error("Registration Error:", err);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}