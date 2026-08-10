import { NextResponse } from 'next/server';
import { getBotLogs } from '../../../lib/logger.js';

export async function GET() {

  const logs = getBotLogs();
  return NextResponse.json({ logs });
}
