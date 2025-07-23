import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const ticketsFile = path.join(process.cwd(), 'vente-bots-discord', 'data', 'tickets.json');

export async function GET() {
  try {
    const data = await fs.readFile(ticketsFile, 'utf8');
    const tickets = JSON.parse(data);
    return NextResponse.json(tickets);
  } catch {
    return NextResponse.json([]);
  }
} 