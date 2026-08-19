import { makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, Browsers } from '@whiskeysockets/baileys';
import pino from 'pino';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const { number } = await req.json();
    if (!number) return Response.json({ error: 'Number required' }, { status: 400 });

    let phoneNumber = number.replace(/[^0-9]/g, '');
    if (phoneNumber.startsWith('0')) phoneNumber = '263' + phoneNumber.slice(1);

    const sessionDir = path.join('/tmp', `session_${phoneNumber}_${Date.now()}`);
    if (!fs.existsSync(sessionDir)) fs.mkdirSync(sessionDir, { recursive: true });

    const { state, saveCreds } = await useMultiFileAuthState(sessionDir);
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
      version,
      auth: state,
      browser: Browsers.ubuntu('Chrome'),
      logger: pino({ level: 'silent' }),
      printQRInTerminal: false,
    });

    sock.ev.on('creds.update', saveCreds);
    await new Promise(r => setTimeout(r, 2000));
    
    const code = await sock.requestPairingCode(phoneNumber);

    setTimeout(() => {
      try { sock.ws.close(); } catch {}
      try { fs.rmSync(sessionDir, { recursive: true, force: true }); } catch {}
    }, 5000);

    const formatted = code.length === 8 ? `${code.slice(0,4)}-${code.slice(4,8)}` : code;
    return Response.json({ code: formatted.toUpperCase() });

  } catch (e) {
    console.error(e);
    return Response.json({ error: e.message }, { status: 500 });
  }
      }
