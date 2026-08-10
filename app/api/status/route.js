import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  let isConnected = false;
  let botNumber = '6283140832250';

  const checkCredsFile = (filePath) => {
    if (!fs.existsSync(filePath)) return null;
    try {
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
  if (fs.existsSync(clonesDir)) {
    try {
      const items = fs.readdirSync(clonesDir, { withFileTypes: true });
      for (const item of items) {
        if (item.isDirectory()) {
          possiblePaths.push(path.join(clonesDir, item.name, 'creds.json'));
        }
      }
    } catch (_) {}
  }

  for (const p of possiblePaths) {
    const res = checkCredsFile(p);
    if (res) {
      isConnected = true;
      if (res.botNumber) botNumber = res.botNumber;
      break;
    }
  }

  
  let totalUsers = 0;
  let totalGroups = 0;
  const dbPath = path.join(process.cwd(), 'data', 'database.json');
  if (fs.existsSync(dbPath)) {
    try {
      const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
      totalUsers = Object.keys(dbData.user || {}).length;
      totalGroups = Object.keys(dbData.group || {}).length;
    } catch (e) {}
  }

  
  let totalCommands = 0;
  const pluginsDir = path.join(process.cwd(), 'plugins');
  if (fs.existsSync(pluginsDir)) {
    const scanDir = (dir) => {
      const files = fs.readdirSync(dir);
      for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
          scanDir(fullPath);
        } else if (file.endsWith('.js')) {
          totalCommands++;
        }
      }
    };
    scanDir(pluginsDir);
  }

  return NextResponse.json({
    botName: 'Cailin Assistant',
    version: '2.0.0',
    status: isConnected ? 'ONLINE' : 'STANDBY',
    isConnected,
    botNumber,
    totalCommands: totalCommands || 150,
    totalUsers,
    totalGroups,
    uptimeSeconds: Math.floor(process.uptime()),
    ramUsageMB: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
    features: [
      'Multi-Session / Multi-Number WhatsApp Support',
      'Fast Startup & Concurrent Command Loader',
      'Zero-Delay Media Caching',
      'Automatic Custom Pairing Code Generator',
      'Live Account Management & Control'
    ]
  });
}
