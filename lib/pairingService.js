import pino from 'pino';
import {
  makeWASocket,
  fetchLatestBaileysVersion,
  Browsers,
  useMultiFileAuthState
} from '@whiskeysockets/baileys';
import path from 'path';
import fs from 'fs';
import { addBotLog } from './logger.js';

let activePairingSocket = null;

// Use a single pino instance to prevent Vercel chunk errors
const logger = pino({ 
  level: 'silent',
  base: null // removes pid/hostname from logs to keep it smaller
});

export async function requestRealBaileysPairingCode(phoneNumber) {
  let cleanNum = phoneNumber.replace(/[^0-9]/g, '');
  if (cleanNum.startsWith('0')) {
    cleanNum = '263' + cleanNum.slice(1);
  }
  if (!cleanNum || cleanNum.length < 9) {
    throw new Error('Phone number must be at least 9 digits!');
  }

  const primarySessionDir = path.join(process.cwd(), 'session', 'session');
  if (!fs.existsSync(primarySessionDir)) {
    fs.mkdirSync(primarySessionDir, { recursive: true });
  }

  // Close any previous socket to avoid conflicts
  if (activePairingSocket) {
    try {
      activePairingSocket.ws?.close();
      activePairingSocket.end?.();
    } catch (e) {}
    activePairingSocket = null;
  }

  const { state, saveCreds } = await useMultiFileAuthState(primarySessionDir);
  
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
    logger // use the shared logger instance instead of pino({...}) inline
  });

  activePairingSocket = conn;
  conn.ev.on('creds.update', saveCreds);

  // Wait for socket to initialize
  await new Promise(resolve => setTimeout(resolve, 1500));

  let rawCode;
  try {
    rawCode = await conn.requestPairingCode(cleanNum);
  } catch (e) {
    const fullErr = e.stack || e.message || String(e);
    console.error('Pairing error full:', fullErr);
    addBotLog('PAIRING_ERROR', `Pairing error (+${cleanNum}): ${e.message || String(e)} | Stack: ${e.stack || 'No stack'}`);
    throw new Error(`Failed to request code from WhatsApp: ${e.message}`);
  }

  const formattedCode = rawCode && rawCode.length === 8 
    ? `${rawCode.slice(0, 4)}-${rawCode.slice(4, 8)}` 
    : rawCode;

  addBotLog('PAIRING', `REAL Baileys WA Pairing Code ${formattedCode} generated directly from WhatsApp Server for +${cleanNum}`);

  // Close socket after getting code to free resources
  setTimeout(() => {
    try {
      conn.ws?.close();
      conn.end?.();
    } catch {}
  }, 5000);

  return formattedCode;
}
