import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const configPath = path.join(process.cwd(), 'data', 'config-admin.json');

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    const configRaw = await fs.readFile(configPath, 'utf8');
    const config = JSON.parse(configRaw);
    const adminPassword = config.admin?.password;

    if (password === adminPassword) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false, error: 'Mot de passe incorrect' }, { status: 401 });
    }
  } catch {
    return NextResponse.json({ success: false, error: 'Erreur serveur' }, { status: 500 });
  }
} 