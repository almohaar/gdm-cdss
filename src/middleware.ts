// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Paths we want to protect (prefix matching).
 * Adjust to match your app.
 */
const PROTECTED_PATHS = [
  '/dashboard',
  '/gdm',
  '/patients',
  '/settings',
  '/app',
];

/**
 * Allowlist of paths to skip middleware checks
 */
const PUBLIC_PATHS = [
  '/auth/login',
  '/auth/register',
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/me',
  '/api/auth/logout',
  '/',
  '/_next',
  '/_static',
  '/favicon.ico',
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip static and public assets quickly
  for (const p of PUBLIC_PATHS) {
    if (pathname === p || pathname.startsWith(p)) {
      return NextResponse.next();
    }
  }

  // Only protect the defined prefixes
  const shouldProtect = PROTECTED_PATHS.some(p => pathname.startsWith(p));
  if (!shouldProtect) return NextResponse.next();

  // Read cookie
  const token = req.cookies.get('token')?.value;
  if (!token) {
    const loginUrl = new URL('/auth/login', req.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // token exists — allow the request through. Detailed role checks should happen server-side.
  return NextResponse.next();
}

/**
 * Configure matcher to run middleware on relevant paths
 * (optional — middleware will run by default: adjust to improve perf)
 */
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/gdm/:path*',
    '/patients/:path*',
    '/settings/:path*',
  ],
};
