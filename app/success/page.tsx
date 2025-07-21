"use client";
import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    localStorage.removeItem('panierNaamsShop');
    window.dispatchEvent(new CustomEvent('panierModifie', { detail: { panier: [] } }));
  }, []);

  return (
    <main style={{
      minHeight: '80vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 16px',
      color: '#fff',
      textAlign: 'center'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 20,
        padding: 40,
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        maxWidth: 500
      }}>
        <div style={{ fontSize: 64, marginBottom: 20 }}>✅</div>
        <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 16, color: '#00c6ff' }}>Paiement réussi !</h1>
        <p style={{ fontSize: 18, color: '#e0e6ed', marginBottom: 24, lineHeight: 1.5 }}>
          Merci pour votre commande&nbsp;! Votre paiement a &eacute;t&eacute; trait&eacute; avec succ&egrave;s.
          {sessionId && (
            <span style={{ display: 'block', marginTop: 8, fontSize: 14, color: '#ccc' }}>
              ID de session: {sessionId}
            </span>
          )}
        </p>
        <p style={{ fontSize: 16, color: '#ccc', marginBottom: 32 }}>
          Vous recevrez bientôt un email de confirmation avec les détails de votre commande.
        </p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => router.push('/')}
            style={{
              background: 'linear-gradient(90deg, #00c6ff 0%, #0072ff 100%)',
              border: 'none',
              borderRadius: 8,
              padding: '12px 24px',
              color: '#fff',
              cursor: 'pointer',
              fontSize: 16,
              fontWeight: 600
            }}
          >
            Retour à l&apos;accueil
          </button>
          <button
            onClick={() => router.push('/catalogue')}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: 8,
              padding: '12px 24px',
              color: '#fff',
              cursor: 'pointer',
              fontSize: 16,
              fontWeight: 600
            }}
          >
            Continuer mes achats
          </button>
        </div>
      </div>
    </main>
  );
}

export default function Success() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  );
} 