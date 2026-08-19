import { NextResponse } from 'next/server';
import { verifyCSRFToken } from '../auth/session/route.js';
export const dynamic = 'force-dynamic';
export async function POST(request) {
  try {
    const csrfToken = request.headers.get('x-csrf-token');
    if (!verifyCSRFToken(csrfToken)) {
      return NextResponse.json({ error: 'CSRF Token is invalid!' }, { status: 403 });
    }
    const { action, phoneNumber } = await request.json();
    if (action !== 'pairing') return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    let cleanNum = phoneNumber.replace(/[^0-9]/g, '');
    if (cleanNum.startsWith('0')) cleanNum = '263' + cleanNum.slice(1);
    const { requestRealBaileysPairingCode } = await import('../../../lib/pairingService.js');
    const pairingCode = await requestRealBaileysPairingCode(cleanNum);
    return NextResponse.json({ success: true, pairingCode, phoneNumber: cleanNum });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
