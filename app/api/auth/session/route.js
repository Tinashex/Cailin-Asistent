import { NextResponse } from 'next/server';
import crypto from 'crypto';


const CSRF_SECRET = process.env.CSRF_SECRET || 'cailin_secure_csrf_secret_key_2026';

export function generateCSRFToken() {
  const timestamp = Date.now().toString();
  const hmac = crypto.createHmac('sha256', CSRF_SECRET).update(timestamp).digest('hex');
  return `${timestamp}.${hmac}`;
}

export function verifyCSRFToken(token) {
  if (!token || typeof token !== 'string') return false;
  const parts = token.split('.');
  if (parts.length !== 2) return false;

  const [timestamp, hmac] = parts;
  
  if (Date.now() - parseInt(timestamp, 10) > 24 * 60 * 60 * 1000) return false;

  const expectedHmac = crypto.createHmac('sha256', CSRF_SECRET).update(timestamp).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(expectedHmac));
}

export async function GET() {
  const csrfToken = generateCSRFToken();
  const response = NextResponse.json({ csrfToken });
  
  
  response.cookies.set('cailin_session', 'authenticated_user_session', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 30 * 24 * 60 * 60 
  });

  return response;
}
