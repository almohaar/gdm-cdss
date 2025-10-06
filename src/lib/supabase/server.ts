// app/api/auth/signup/route.ts
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { email, password, name, phone } = await req.json();

    // 1. Create user in Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error)
      return NextResponse.json({ error: error.message }, { status: 400 });

    const supabaseUser = data.user;

    // 2. Store in your User table
    await prisma.user.create({
      data: {
        id: supabaseUser?.id,
        email,
        name,
        phone,
        password: 'AUTH_MANAGED', // never store plain password
      },
    });

    return NextResponse.json({ success: true, user: supabaseUser });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
