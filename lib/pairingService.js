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

export async function requestRealBaileysPairingCode(phoneNumber) {
  let cleanNum = phoneNumber.replace(/[^0-9]/g, '');
  if (cleanNum.startsWith('0')) {
    cleanNum = '62' + cleanNum.slice(1);
  }
  if (!cleanNum || cleanNum.length < 9) {
    throw new Error('Nomor telepon minimal 9 digit!');
  }

  
  const primarySessionDir = path.join(process.cwd(), 'session', 'session');
  if (!fs.existsSync(primarySessionDir)) {
    fs.mkdirSync(primarySessionDir, { recursive: true });
  }

  
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
    logger: pino({ level: 'silent' })
  });

  activePairingSocket = conn;
  conn.ev.on('creds.update', saveCreds);

  
  await new Promise(resolve => setTimeout(resolve, 1500));

  let rawCode;
  try {
    rawCode = await conn.requestPairingCode(cleanNum);
  } catch (e) {
    const fullErr = e.stack || e.message || String(e);
    console.error('Pairing error full:', fullErr);
    addBotLog('PAIRING_ERROR', `Pairing error (+${cleanNum}): ${e.message || String(e)} | Stack: ${e.stack || 'No stack'}`);
    throw new Error(`Gagal meminta kode ke WhatsApp: ${e.message}`);
  }


  const formattedCode = rawCode && rawCode.length === 8 
    ? `${rawCode.slice(0, 4)}-${rawCode.slice(4, 8)}` 
    : rawCode;

  addBotLog('PAIRING', `REAL Baileys WA Pairing Code ${formattedCode} generated directly from WhatsApp Server for +${cleanNum}`);

  return formattedCode;
}
