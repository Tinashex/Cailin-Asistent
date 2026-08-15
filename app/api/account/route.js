import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { addBotLog } from '../../../lib/logger.js';
import { verifyCSRFToken } from '../auth/session/route.js';

export async function POST(request) {
  try {
    const csrfToken = request.headers.get('x-csrf-token');
    if (!verifyCSRFToken(csrfToken)) {
      return NextResponse.json({ error: 'CSRF Token is invalid or has expired!' }, { status: 403 });
    }

    const { action, phoneNumber, key, value } = await request.json();

    if (action === 'pairing') {
      if (!phoneNumber || typeof phoneNumber !== 'string') {
        return NextResponse.json({ error: 'Invalid WhatsApp number' }, { status: 400 });
      }

      let cleanNum = phoneNumber.replace(/[^0-9]/g, '');
      if (cleanNum.startsWith('0')) {
        cleanNum = '263' + cleanNum.slice(1);
      }
      if (cleanNum.length < 9) {
        return NextResponse.json({ error: 'Phone number must be at least 9 digits' }, { status: 400 });
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
          error: 'Failed to get pairing code from WhatsApp Server. Please try again.' 
        }, { status: 500 });
      }

      if (pairingCode === 'REGISTERED' || pairingCode === 'CONNECTED') {
        return NextResponse.json({
          success: true,
          pairingCode: 'CONNECTED',
          status: 'CONNECTED',
          isRegistered: true,
          phoneNumber: cleanNum,
          message: `Number +${cleanNum} is already CONNECTED & ACTIVE as a WhatsApp Bot!`
        });
      }

      addBotLog('PAIRING', `Multi-Session Web: Requesting pairing for session [${sessionName}] for +${cleanNum}`);

      return NextResponse.json({
        success: true,
        pairingCode,
        isRegistered: false,
        phoneNumber: cleanNum,
        message: `Session [${sessionName}] created! Please use the pairing code on your WhatsApp.`
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
        message: `Setting ${key} updated successfully!`
      });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    const fullErr = error.stack || error.message || String(error);
    console.error('[API ACCOUNT ERROR FULL]:', fullErr);
    addBotLog('PAIRING_ERROR', `API Account Error: ${error.message || String(error)} | Stack: ${error.stack || 'No stack'}`);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  }
