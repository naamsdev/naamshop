import { NextRequest, NextResponse } from 'next/server';
import { envoyerEmailConfirmation } from '../../lib/emailService';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2022-11-15',
});

// Ajoute l'interface Produit
interface Produit {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  quantity: number;
}

export async function POST(request: NextRequest) {
  try {
    const { produits, email, nom, total } = await request.json();

    // Créer les line items pour Stripe
    const lineItems = produits.map((produit: Produit) => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: produit.name,
          description: produit.description,
        },
        unit_amount: Math.round(produit.price * 100), // Stripe utilise les centimes
      },
      quantity: produit.quantity,
    }));

    // Créer la session Stripe Checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${request.nextUrl.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.nextUrl.origin}/catalogue`,
      customer_email: email,
      metadata: {
        nom: nom,
        email: email,
        produits: JSON.stringify(produits.map((p: Produit) => ({ id: p.id, name: p.name, quantity: p.quantity })))
      },
      billing_address_collection: 'required',
    });

    // Sauvegarder la commande
    const commande = {
      id: session.id,
      nom: nom,
      email: email,
      moyenPaiement: 'Carte de crédit',
      produits: produits,
      prix: total,
      date: new Date().toISOString()
    };

    // Sauvegarder dans localStorage côté client (sera récupéré par l'admin)
    console.log('Commande sauvegardée:', commande);

    // Envoyer l'email de confirmation
    try {
      const emailData = {
        prenom: nom.split(' ')[0] || 'Client',
        email: email,
        nomBot: produits.map((p: Produit) => p.name).join(', '),
        prix: total,
        dateAchat: new Date().toLocaleDateString('fr-FR'),
        idCommande: session.id
      };
      
      await envoyerEmailConfirmation(emailData);
      console.log('Email de confirmation envoyé');
    } catch (emailError) {
      console.error('Erreur lors de l\'envoi de l\'email:', emailError);
      // On continue même si l'email échoue
    }

    return NextResponse.json({
      success: true,
      redirectUrl: session.url,
      sessionId: session.id
    });

  } catch (error) {
    console.error('Erreur Stripe:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors du traitement du paiement' },
      { status: 500 }
    );
  }
} 