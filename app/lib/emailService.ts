// ATTENTION : Assurez-vous d'avoir installé nodemailer avec `npm install nodemailer` avant d'utiliser ce module.
import nodemailer from 'nodemailer';

interface EmailData {
  prenom: string;
  email: string;
  nomBot: string;
  prix: number;
  dateAchat: string;
  idCommande: string;
}

export async function envoyerEmailConfirmation(data: EmailData) {
  try {
    // Configuration du transporteur email (Gmail)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // ton email Gmail
        pass: process.env.EMAIL_PASSWORD // ton mot de passe d'application Gmail
      }
    });

    // Contenu de l'email
    const mailOptions = {
      from: `"NaamsShop" <${process.env.EMAIL_USER}>`,
      to: data.email,
      subject: '🤖 Merci pour votre achat ! Votre bot Discord est bientôt prêt !',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h1 style="color: #333; text-align: center; margin-bottom: 30px;">🤖 Merci pour votre achat !</h1>
            
            <p style="font-size: 16px; color: #555; margin-bottom: 20px;">
              Bonjour <strong>${data.prenom}</strong>,
            </p>
            
            <p style="font-size: 16px; color: #555; margin-bottom: 20px;">
              Merci pour votre commande ! 🎉<br>
              Nous sommes ravis de vous accueillir parmi nos utilisateurs de bots Discord.
            </p>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">🧾 Récapitulatif de votre commande :</h3>
              <p style="margin: 10px 0;"><strong>Produit :</strong> ${data.nomBot}</p>
              <p style="margin: 10px 0;"><strong>Prix :</strong> ${data.prix}€</p>
              <p style="margin: 10px 0;"><strong>Date d'achat :</strong> ${data.dateAchat}</p>
              <p style="margin: 10px 0;"><strong>ID de commande :</strong> ${data.idCommande}</p>
            </div>
            
            <div style="background-color: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #1976d2; margin-top: 0;">🚀 Que faire maintenant ?</h3>
              <p style="margin: 10px 0;">
                Votre bot est bientôt prêt à être intégré à votre serveur Discord !
              </p>
              <p style="margin: 10px 0;">
                👉 Notre équipe va vous recontacter sous peu afin de vous transmettre votre bot et vous accompagner dans sa mise en place.
              </p>
            </div>
            
            <p style="font-size: 16px; color: #555; margin-bottom: 20px;">
              Si vous avez des questions ou besoin d'assistance, notre équipe est là pour vous aider.<br>
              Encore merci pour votre confiance !
            </p>
            
            <p style="font-size: 16px; color: #333; font-weight: bold;">
              À très bientôt,<br>
              L'équipe NaamsShop
            </p>
          </div>
        </div>
      `
    };

    // Envoyer l'email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email envoyé avec succès:', info.messageId);
    return { success: true, messageId: info.messageId };

  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Erreur lors de l'envoi de l'email:", error);
      return { success: false, error: error.message };
    } else {
      console.error("Erreur inconnue lors de l'envoi de l'email:", error);
      return { success: false, error: 'Erreur inconnue' };
    }
  }
} 