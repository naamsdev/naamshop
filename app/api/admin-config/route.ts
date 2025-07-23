import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const configFile = path.join(process.cwd(), 'vente-bots-discord', 'data', 'config-admin.json');

export async function GET() {
  try {
    const data = await fs.readFile(configFile, 'utf8');
    const config = JSON.parse(data);
    const password = config?.admin?.password || '';
    return NextResponse.json({ password });
  } catch {
    return NextResponse.json({ password: '' });
  }
} 