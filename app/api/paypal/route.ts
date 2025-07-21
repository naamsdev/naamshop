import { NextRequest, NextResponse } from 'next/server';
import { envoyerEmailConfirmation } from '../../lib/emailService';

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

    // Configuration PayPal (remplace par tes vraies clés)
    const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID || 'test';
    const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET || 'test';
    const PAYPAL_MODE = 'live'; // Forcer le mode production

    // Créer l'ordre PayPal
    const orderData = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'EUR',
            value: total.toString(),
            breakdown: {
              item_total: {
                currency_code: 'EUR',
                value: total.toString()
              }
            }
          },
          items: produits.map((produit: Produit) => ({
            name: produit.name,
            unit_amount: {
              currency_code: 'EUR',
              value: produit.price.toString()
            },
            quantity: produit.quantity.toString()
          })),
          description: `Commande NaamsShop - ${produits.length} produit(s)`
        }
      ],
      application_context: {
        return_url: `${request.nextUrl.origin}/success`,
        cancel_url: `${request.nextUrl.origin}/catalogue`,
        brand_name: 'NaamsShop',
        shipping_preference: 'NO_SHIPPING'
      }
    };

    // Utiliser PayPal en mode production
    console.log('Mode production - Utilisation PayPal Live');

    // En production, utiliser l'API PayPal réelle
    const response = await fetch(`https://api-m.${PAYPAL_MODE === 'live' ? 'paypal' : 'sandbox.paypal'}.com/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64')}`
      },
      body: JSON.stringify(orderData)
    });

    const data = await response.json();

    if (data.id) {
      const redirectUrl = PAYPAL_MODE === 'live' 
        ? `https://www.paypal.com/checkoutnow?token=${data.id}`
        : `https://www.sandbox.paypal.com/checkoutnow?token=${data.id}`;

      // Sauvegarder la commande
      const commande = {
        id: data.id,
        nom: nom,
        email: email,
        moyenPaiement: 'PayPal',
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
          idCommande: data.id
        };
        
        await envoyerEmailConfirmation(emailData);
        console.log('Email de confirmation envoyé');
      } catch (emailError) {
        console.error('Erreur lors de l\'envoi de l\'email:', emailError);
        // On continue même si l'email échoue
      }

      return NextResponse.json({
        success: true,
        redirectUrl,
        orderId: data.id
      });
    } else {
      throw new Error('Erreur lors de la création de l\'ordre PayPal');
    }

  } catch (error) {
    console.error('Erreur PayPal:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors du traitement du paiement' },
      { status: 500 }
    );
  }
} 