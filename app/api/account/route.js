import { NextResponse } from 'next/server';
import { verifyCSRFToken } from '../auth/session/route.js';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request) {
  try {
    const csrfToken = request.headers.get('x-csrf-token');

    if (!csrfToken) {
      return NextResponse.json(
        { error: 'CSRF Token is missing!' },
        { status: 403 }
      );
    }

    if (!verifyCSRFToken(csrfToken)) {
      return NextResponse.json(
        { error: 'CSRF Token is invalid!' },
        { status: 403 }
      );
    }

    let body;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON request body!' },
        { status: 400 }
      );
    }

    const { action, phoneNumber } = body || {};

    if (action !== 'pairing') {
      return NextResponse.json(
        { error: 'Unknown action' },
        { status: 400 }
      );
    }

    if (!phoneNumber || typeof phoneNumber !== 'string') {
      return NextResponse.json(
        { error: 'Phone number is required!' },
        { status: 400 }
      );
    }

    let cleanNum = phoneNumber.replace(/[^0-9]/g, '');

    if (cleanNum.startsWith('0')) {
      cleanNum = '263' + cleanNum.slice(1);
    }

    if (!cleanNum || cleanNum.length < 9) {
      return NextResponse.json(
        { error: 'Invalid phone number!' },
        { status: 400 }
      );
    }

    console.log(`📱 Pairing request received for: ${cleanNum}`);

    const {
      requestRealBaileysPairingCode
    } = await import('../../../lib/pairingService.js');

    const pairingCode = await requestRealBaileysPairingCode(cleanNum);

    if (!pairingCode) {
      return NextResponse.json(
        { error: 'WhatsApp did not return a pairing code!' },
        { status: 500 }
      );
    }

    console.log(`✅ Pairing code generated for: ${cleanNum}`);

    return NextResponse.json(
      {
        success: true,
        pairingCode,
        phoneNumber: cleanNum
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
  } catch (error) {
    console.error('❌ Account API error:', error);

    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Failed to process account request'
      },
      { status: 500 }
    );
  }
}
