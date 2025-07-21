"use client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <main style={{
      minHeight: '80vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff',
      padding: '40px 16px',
      background: 'none',
      maxWidth: 900,
      margin: '0 auto',
    }}>
      <h1 style={{
        fontSize: 48,
        fontWeight: 900,
        marginBottom: 12,
        letterSpacing: 2,
        textAlign: 'center',
        color: '#00c6ff',
        textShadow: '0 2px 16px rgba(0,0,0,0.25)'
      }}>
        Bienvenue sur <span style={{ color: '#fff', background: 'linear-gradient(90deg, #00c6ff 0%, #0072ff 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>NaamsShop</span>
      </h1>
      <h2 style={{ fontSize: 28, fontWeight: 700, margin: '12px 0 24px 0', textAlign: 'center', color: '#fff' }}>
        Votre boutique de bots Discord personnalisé
      </h2>
      <p style={{ fontSize: 20, color: '#e0e6ed', textAlign: 'center', marginBottom: 32, lineHeight: 1.6 }}>
        Chez NaamsShop, nous vous proposons des bots Discord performants, stables et personnalisés. Que vous soyez à la tête d’une communauté gamer, d’un serveur RP, d’une entreprise ou simplement d’un groupe d’amis, vous trouverez votre bonheur par ici pour automatiser, divertir et fidéliser votre serveur.
      </p>
      <h3 style={{ fontSize: 24, color: '#00c6ff', margin: '24px 0 8px 0', fontWeight: 800 }}>🔧 Des bots pour tous les besoins</h3>
      <p style={{ fontSize: 18, color: '#e0e6ed', textAlign: 'center', marginBottom: 16 }}>
        Des bots à utiliser immédiatement jusqu’à totalement personnalisables, nous avons une large gamme de bots disponibles, tel que :
      </p>
      <ul style={{ fontSize: 18, color: '#fff', margin: '0 0 24px 0', padding: 0, listStyle: 'none', textAlign: 'center' }}>
        <li style={{ marginBottom: 6 }}>🛡️ <b>Bots de modération</b> pour soutenir la sécurité de votre serveur</li>
        <li style={{ marginBottom: 6 }}>🎟️ <b>Système de ticket</b> pour une prise en charge du support utilisée</li>
        <li style={{ marginBottom: 6 }}>💰 <b>Économie fictive</b> et système de niveaux</li>
        <li style={{ marginBottom: 6 }}>🎲 <b>Minijeux</b>, commandes fun et participation de la communauté</li>
      </ul>
      <h3 style={{ fontSize: 24, color: '#00c6ff', margin: '24px 0 8px 0', fontWeight: 800 }}>🚀 Pourquoi NaamsShop ?</h3>
      <ul style={{ fontSize: 18, color: '#fff', margin: '0 0 24px 0', padding: 0, listStyle: 'none', textAlign: 'center' }}>
        <li style={{ marginBottom: 6 }}>✅ Un code customisé à votre image</li>
        <li style={{ marginBottom: 6 }}>🔒 Sécurisé et propre à acheter en toute confiance</li>
        <li style={{ marginBottom: 6 }}>⏱️ Livraison rapide avec un suivi réactif</li>
        <li style={{ marginBottom: 6 }}>💬 Un support à votre écoute avant et après vente</li>
        <li style={{ marginBottom: 6 }}>💳 Un site 100% sécurisé</li>
      </ul>
      <h3 style={{ fontSize: 24, color: '#00c6ff', margin: '24px 0 8px 0', fontWeight: 800 }}>🛠️ Un projet à concrétiser ?</h3>
      <p style={{ fontSize: 18, color: '#e0e6ed', textAlign: 'center', marginBottom: 40 }}>
        De l’idée jusqu’à la mise en ligne, nous vous suivons à chaque étape. Que vous vouliez un bot simple ou une série de fonctionnalités spécifiques, NaamsShop prendra soin de votre serveur.
      </p>
      <button
        style={{
          background: 'linear-gradient(90deg, #00c6ff 0%, #0072ff 100%)',
          color: '#fff',
          border: 'none',
          borderRadius: 10,
          padding: '18px 48px',
          fontSize: 22,
          fontWeight: 800,
          cursor: 'pointer',
          boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
          transition: 'transform 0.1s',
          letterSpacing: 1,
        }}
        onClick={() => router.push('/catalogue')}
      >
        Découvrir le catalogue
      </button>
    </main>
  );
}
