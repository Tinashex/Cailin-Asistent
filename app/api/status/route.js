import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET() {
  let isConnected = false;
  let botNumber = '263781330745';
  const isVercel =!!process.env.VERCEL;

  // On Vercel, we cannot read local session files — skip filesystem checks
  if (!isVercel) {
    const checkCredsFile = (filePath) => {
      try {
        if (!fs.existsSync(filePath)) return null;
        const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        if (data && (data.registered || data.me)) {
          let num = null;
          if (data.me?.id) {
            num = data.me.id.split(':')[0].replace(/[^0-9]/g, '');
          }
          return { isConnected: true, botNumber: num };
        }
      } catch (_) {}
      return null;
    };

    const possiblePaths = [
      path.join(process.cwd(), 'session', 'creds.json'),
      path.join(process.cwd(), 'session', 'session', 'creds.json'),
    ];

    const clonesDir = path.join(process.cwd(), 'session_clones');
    try {
      if (fs.existsSync(clonesDir)) {
        const items = fs.readdirSync(clonesDir, { withFileTypes: true });
        for (const item of items) {
          if (item.isDirectory()) {
            possiblePaths.push(path.join(clonesDir, item.name, 'creds.json'));
          }
        }
      }
    } catch (_) {}

    for (const p of possiblePaths) {
      const res = checkCredsFile(p);
      if (res) {
        isConnected = true;
        if (res.botNumber) botNumber = res.botNumber;
        break;
      }
    }
  }

  // Database stats (safe with try/catch)
  let totalUsers = 0;
  let totalGroups = 0;
  if (!isVercel) {
    const dbPath = path.join(process.cwd(), 'data', 'database.json');
    try {
      if (fs.existsSync(dbPath)) {
        const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
        totalUsers = Object.keys(dbData.user || {}).length;
        totalGroups = Object.keys(dbData.group || {}).length;
      }
    } catch (e) {}
  }

  // Command count
  let totalCommands = 150; // default for Vercel
  if (!isVercel) {
    const pluginsDir = path.join(process.cwd(), 'plugins');
    try {
      if (fs.existsSync(pluginsDir)) {
        let count = 0;
        const scanDir = (dir) => {
          const files = fs.readdirSync(dir);
          for (const file of files) {
            const fullPath = path.join(dir, file);
            try {
              if (fs.statSync(fullPath).isDirectory()) {
                scanDir(fullPath);
              } else if (file.endsWith('.js')) {
                count++;
              }
            } catch {}
          }
        };
        scanDir(pluginsDir);
        if (count > 0) totalCommands = count;
      }
    } catch {}
  }

  return NextResponse.json({
    botName: 'Cailin Assistant',
    version: '2.0.0',
    status: isConnected? 'ONLINE' : 'STANDBY',
    isConnected,
    botNumber,
    totalCommands,
    totalUsers,
    totalGroups,
    uptimeSeconds: Math.floor(process.uptime()),
    ramUsageMB: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
    platform: isVercel? 'vercel' : 'vps',
    features: [
      'Multi-Session / Multi-Number WhatsApp Support',
      'Fast Startup & Concurrent Command Loader',
      'Zero-Delay Media Caching',
      'Automatic Custom Pairing Code Generator',
      'Live Account Management & Control'
    ]
  });
}
