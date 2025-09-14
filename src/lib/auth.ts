import { cookies } from 'next/headers';
import { signJwt, verifyJwt } from './jwt';
// import { prisma } from './prisma';

const COOKIE_NAME = 'auth_token';

export async function setAuthCookie(userId: string) {
  const token = signJwt({ sub: userId });
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
}

export async function clearAuthCookie() {
    const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getCurrentUser() {
    const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  const payload = verifyJwt<{ sub: string }>(token);
  if (!payload) return null;

  return ''
}
