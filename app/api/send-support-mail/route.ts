import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

function guessService(email: string): string {
  if (email.endsWith('@gmail.com')) return 'gmail';
  if (email.endsWith('@outlook.com') || email.endsWith('@hotmail.com')) return 'hotmail';
  if (email.endsWith('@yahoo.com')) return 'yahoo';
  // Ajoute d'autres services si besoin
  return 'gmail'; // Par défaut
}

export async function POST(req: NextRequest) {
  try {
    const { nom, email, sujet, message } = await req.json();
    if (!nom || !email || !sujet || !message) {
      return NextResponse.json({ success: false, error: 'Champs manquants.' }, { status: 400 });
    }

    const service = guessService(process.env.EMAIL_USER || '');
    const transporter = nodemailer.createTransport({
      service,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `Support NaamsShop <${process.env.EMAIL_USER}>`,
      to: process.env.SUPPORT_DEST || process.env.EMAIL_USER,
      subject: `[Support] ${sujet}`,
      replyTo: email,
      text: `Nom: ${nom}\nEmail: ${email}\nSujet: ${sujet}\nMessage:\n${message}`,
      html: `<b>Nom:</b> ${nom}<br/><b>Email:</b> ${email}<br/><b>Sujet:</b> ${sujet}<br/><b>Message:</b><br/>${message.replace(/\n/g, '<br/>')}`,
    });

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    let errorMessage = 'Erreur envoi mail.';
    if (err instanceof Error) {
      errorMessage = err.message;
    }
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
} 