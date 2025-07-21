import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { readFileSync } from 'fs';
import { join } from 'node:path';

// Correction : utilisation d'une version d'API Stripe stable et existante
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2022-11-15' });

// Ajoute l'interface Bot
interface Bot {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

export async function POST(req: NextRequest) {
  const { botId } = await req.json();
  const filePath = join(process.cwd(), 'data', 'bots.json');
  const bots = JSON.parse(readFileSync(filePath, 'utf-8'));
  const bot = bots.find((b: Bot) => b.id === botId);
  if (!bot) return NextResponse.json({ error: 'Bot non trouvé' }, { status: 404 });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'eur',
          product_data: {
            name: bot.name,
            description: bot.description,
          },
          unit_amount: Math.round(bot.price * 100),
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: process.env.NEXT_PUBLIC_BASE_URL + '/success',
    cancel_url: process.env.NEXT_PUBLIC_BASE_URL + '/',
  });

  return NextResponse.json({ url: session.url });
} 