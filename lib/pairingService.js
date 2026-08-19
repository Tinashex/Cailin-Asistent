import pino from 'pino';
import {
  makeWASocket,
  fetchLatestBaileysVersion,
  Browsers,
  useMultiFileAuthState
} from '@whiskeysockets/baileys';
import path from 'path';
import fs from 'fs';
import os from 'os';

export async function requestRealBaileysPairingCode(phoneNumber) {
  let cleanNum = phoneNumber.replace(/[^0-9]/g, '');
  if (cleanNum.startsWith('0')) {
    cleanNum = '263' + cleanNum.slice(1);
  }
  if (!cleanNum || cleanNum.length < 9) {
    throw new Error('Nomor telepon minimal 9 digit!');
  }

  // FIX FOR VERCEL: Use /tmp not ./session/session
  // This stops overwriting your main bot session and fixes pino error
  const isVercel = !!process.env.VERCEL;
  const baseDir = isVercel ? os.tmpdir() : path.join(process.cwd(), 'session');
  const sessionDir = path.join(baseDir, `pairing_${cleanNum}_${Date.now()}`);
  
  if (!fs.existsSync(sessionDir)) {
    fs.mkdirSync(sessionDir, { recursive: true });
  }

  const { state, saveCreds } = await useMultiFileAuthState(sessionDir);
  let version;
  try {
    const vData = await fetchLatestBaileysVersion();
    version = vData.version;
  } catch (_) {
    version = [2, 3000, 1043857760];
  }

  const conn = makeWASocket({
    printQRInTerminal: false,
    auth: state,
    version,
    browser: Browsers.ubuntu('Chrome'),
    syncFullHistory: false,
    logger: pino({ level: 'silent' })
  });

  conn.ev.on('creds.update', saveCreds);

  await new Promise(resolve => setTimeout(resolve, 1500));

  let rawCode;
  try {
    rawCode = await conn.requestPairingCode(cleanNum);
  } catch (e) {
    console.error('Pairing error:', e.stack || e.message);
    try { fs.rmSync(sessionDir, { recursive: true, force: true }); } catch {}
    throw new Error(`Gagal meminta kode ke WhatsApp: ${e.message}`);
  }

  // Auto cleanup after 10 seconds
  setTimeout(() => {
    try { conn.ws?.close(); } catch {}
    try { conn.end?.(); } catch {}
    try { fs.rmSync(sessionDir, { recursive: true, force: true }); } catch {}
  }, 10000);

  const formattedCode = rawCode && rawCode.length === 8 
    ? `${rawCode.slice(0, 4)}-${rawCode.slice(4, 8)}` 
    : rawCode;

  return formattedCode.toUpperCase();
  }
