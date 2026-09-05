import { NextResponse } from 'next/server';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const CSRF_SECRET =
  process.env.CSRF_SECRET || 'cailin_secure_csrf_secret_key_2026';

const CSRF_MAX_AGE = 24 * 60 * 60 * 1000;

export function generateCSRFToken() {
  const timestamp = Date.now().toString();

  const hmac = crypto
    .createHmac('sha256', CSRF_SECRET)
    .update(timestamp)
    .digest('hex');

  return `${timestamp}.${hmac}`;
}

export function verifyCSRFToken(token) {
  try {
    if (!token || typeof token !== 'string') {
      return false;
    }

    const parts = token.split('.');

    if (parts.length !== 2) {
      return false;
    }

    const [timestamp, hmac] = parts;

    if (!/^\d+$/.test(timestamp)) {
      return false;
    }

    if (!/^[a-f0-9]{64}$/i.test(hmac)) {
      return false;
    }

    const tokenTime = Number(timestamp);

    if (!Number.isSafeInteger(tokenTime)) {
      return false;
    }

    const age = Date.now() - tokenTime;

    if (age < 0 || age > CSRF_MAX_AGE) {
      return false;
    }

    const expectedHmac = crypto
      .createHmac('sha256', CSRF_SECRET)
      .update(timestamp)
      .digest('hex');

    const receivedBuffer = Buffer.from(hmac, 'utf8');
    const expectedBuffer = Buffer.from(expectedHmac, 'utf8');

    if (receivedBuffer.length !== expectedBuffer.length) {
      return false;
    }

    return crypto.timingSafeEqual(receivedBuffer, expectedBuffer);
  } catch (error) {
    console.error('CSRF verification error:', error);
    return false;
  }
}

export async function GET() {
  try {
    const csrfToken = generateCSRFToken();

    const response = NextResponse.json(
      {
        success: true,
        csrfToken
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          Pragma: 'no-cache',
          Expires: '0'
        }
      }
    );

    response.cookies.set('cailin_session', 'authenticated_user_session', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 30 * 24 * 60 * 60
    });

    return response;
  } catch (error) {
    console.error('CSRF session error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create secure session'
      },
      {
        status: 500,
        headers: {
          'Cache-Control': 'no-store'
        }
      }
    );
  }
}
