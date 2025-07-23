import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';

const ticketsFile = path.join(process.cwd(), 'vente-bots-discord', 'data', 'tickets.json');

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nom, email, produit, description, type } = body;
    if (!nom || !email || !produit || !description) {
      return NextResponse.json({ error: 'Champs manquants' }, { status: 400 });
    }

    // 1. Enregistrer le ticket
    let tickets = [];
    try {
      const data = await fs.readFile(ticketsFile, 'utf8');
      tickets = JSON.parse(data);
    } catch {}
    const nouveauTicket = {
      id: Date.now().toString(),
      nom,
      email,
      produit,
      description,
      type,
      date: new Date().toISOString()
    };
    tickets.push(nouveauTicket);
    await fs.mkdir(path.dirname(ticketsFile), { recursive: true });
    await fs.writeFile(ticketsFile, JSON.stringify(tickets, null, 2));

    // 2. Envoyer un email à l'admin
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
    await transporter.sendMail({
      from: `NaamsShop <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: 'Nouvelle demande Achat personnalisé',
      html: `
        <h2>Nouvelle demande Achat personnalisé</h2>
        <ul>
          <li><b>Nom :</b> ${nom}</li>
          <li><b>Email :</b> ${email}</li>
          <li><b>Produit personnalisé :</b> ${produit}</li>
          <li><b>Description :</b> ${description}</li>
        </ul>
        <p>Date : ${nouveauTicket.date}</p>
      `
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur ticket:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
} 