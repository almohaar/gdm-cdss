// lib/jwt.ts
// import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret';

export function signJwt(payload: object, expiresIn = '7d') {
  return ''
}

export function verifyJwt<T>(token: string): T | null {
  try {
    return null
  } catch {
    return null;
  }
}
