import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { addBotLog } from '../../../lib/logger.js';
import { verifyCSRFToken } from '../auth/session/route.js';

export async function POST(request) {
  try {
    const csrfToken = request.headers.get('x-csrf-token');
    if (!verifyCSRFToken(csrfToken)) {
      return NextResponse.json({ error: 'CSRF Token tidak valid atau kedaluwarsa!' }, { status: 403 });
    }

    const { action, phoneNumber, key, value } = await request.json();

    if (action === 'pairing') {
      if (!phoneNumber || typeof phoneNumber !== 'string') {
        return NextResponse.json({ error: 'Nomor WhatsApp tidak valid' }, { status: 400 });
      }

      let cleanNum = phoneNumber.replace(/[^0-9]/g, '');
      if (cleanNum.startsWith('0')) {
        cleanNum = '62' + cleanNum.slice(1);
      }
      if (cleanNum.length < 9) {
        return NextResponse.json({ error: 'Nomor telepon minimal 9 digit' }, { status: 400 });
      }

      const sessionName = `user_${cleanNum}`;

      let pairingCode = null;

      
      if (typeof global.startNewWebSession === 'function') {
        const sessionSock = await global.startNewWebSession(sessionName, cleanNum);
        if (sessionSock && sessionSock.pairingCodeResult) {
          pairingCode = sessionSock.pairingCodeResult;
        }
      }

      
      if (!pairingCode) {
        const { createCloneSession } = await import('../../../lib/cloneManager.js');
        pairingCode = await createCloneSession(cleanNum);
      }

      if (!pairingCode) {
        return NextResponse.json({ 
          error: 'Gagal mendapatkan kode pairing dari WhatsApp Server. Silakan coba lagi.' 
        }, { status: 500 });
      }



      if (pairingCode === 'REGISTERED' || pairingCode === 'TERHUBUNG') {
        return NextResponse.json({
          success: true,
          pairingCode: 'TERHUBUNG',
          status: 'TERHUBUNG',
          isRegistered: true,
          phoneNumber: cleanNum,
          message: `Nomor +${cleanNum} sudah TERHUBUNG & AKTIF sebagai Bot WhatsApp!`
        });
      }

      addBotLog('PAIRING', `Multi-Session Web: Meminta pairing sesi [${sessionName}] untuk +${cleanNum}`);

      return NextResponse.json({
        success: true,
        pairingCode,
        isRegistered: false,
        phoneNumber: cleanNum,
        message: `Sesi [${sessionName}] dibuat! Silakan gunakan kode pairing di WhatsApp Anda.`
      });
    }

    if (action === 'toggle_setting') {
      const configPath = path.join(process.cwd(), 'data', 'config_overrides.json');
      let currentConfig = {};
      if (fs.existsSync(configPath)) {
        try {
          currentConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
        } catch (e) {}
      }

      currentConfig[key] = value;
      fs.writeFileSync(configPath, JSON.stringify(currentConfig, null, 2));

      return NextResponse.json({
        success: true,
        key,
        value,
        message: `Pengaturan ${key} berhasil diperbarui!`
      });
    }

    return NextResponse.json({ error: 'Aksi tidak diketahui' }, { status: 400 });
  } catch (error) {
    const fullErr = error.stack || error.message || String(error);
    console.error('[API ACCOUNT ERROR FULL]:', fullErr);
    addBotLog('PAIRING_ERROR', `API Account Error: ${error.message || String(error)} | Stack: ${error.stack || 'No stack'}`);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
