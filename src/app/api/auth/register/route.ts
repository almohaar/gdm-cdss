// app/api/auth/register/route.ts
// import { prisma } from '@/lib/prisma';
import { setAuthCookie } from '@/lib/auth';
// import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { email, password, name } = await req.json();

  // const existing = await prisma.user.findUnique({ where: { email } });
  // if (existing)
  //   return NextResponse.json({ error: 'User already exists' }, { status: 400 });

  // const hashed = await bcrypt.hash(password, 10);

  // const user = await prisma.user.create({
  //   data: { email, password: hashed, name },
  // });

  // await setAuthCookie(user.id);

  return NextResponse.json({
    user: { id: "" },
  });
}
