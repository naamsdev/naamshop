"use client";
import { useState, useEffect } from "react";

interface Bot {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  quantity?: number;
}

export default function Catalogue() {
  // const router = useRouter(); // Supprimé car non utilisé
  const [bots, setBots] = useState<Bot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/bots')
      .then(res => res.json())
      .then(data => {
        setBots(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Erreur lors du chargement des bots:', error);
        setLoading(false);
      });
  }, []);

  const ajouterAuPanier = (bot: Bot) => {
    // Récupérer le panier actuel
    const panierActuel = localStorage.getItem('panierNaamsShop');
    let panier = panierActuel ? JSON.parse(panierActuel) : [];
    
    // Vérifier si le bot est déjà dans le panier
    const botExistant = panier.find((item: Bot) => item.id === bot.id);
    
    if (botExistant) {
      // Si le bot existe déjà, augmenter la quantité
      panier = panier.map((item: Bot) => 
        item.id === bot.id 
          ? { ...item, quantity: (item.quantity ?? 1) + 1 }
          : item
      );
    } else {
      // Sinon, ajouter le nouveau bot avec quantité 1
      panier.push({ ...bot, quantity: 1 });
    }
    
    // Sauvegarder le panier
    localStorage.setItem('panierNaamsShop', JSON.stringify(panier));
    
    // Déclencher un événement personnalisé pour notifier la NavBar
    window.dispatchEvent(new CustomEvent('panierModifie', { 
      detail: { panier } 
    }));
    
    // Afficher une confirmation
    alert(`${bot.name} a été ajouté au panier !`);
  };

  if (loading) {
    return (
      <main style={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontSize: 20
      }}>
        Chargement du catalogue...
      </main>
    );
  }

  return (
    <main style={{
      minHeight: '80vh',
      padding: '40px 16px',
      maxWidth: 1200,
      margin: '0 auto',
      color: '#fff'
    }}>
      <h1 style={{
        fontSize: 36,
        fontWeight: 900,
        textAlign: 'center',
        marginBottom: 40,
        color: '#00c6ff'
      }}>
        Catalogue des Bots
      </h1>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '24px',
        marginBottom: '40px'
      }}>
        {bots.map((bot) => (
          <div
            key={bot.id}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: 16,
              padding: 24,
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              transition: 'transform 0.2s, box-shadow 0.2s',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{
              width: '100%',
              height: 200,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: 12,
              marginBottom: 16,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 48,
              color: '#fff'
            }}>
              🤖
            </div>

            <h3 style={{
              fontSize: 20,
              fontWeight: 700,
              marginBottom: 8,
              color: '#fff'
            }}>
              {bot.name}
            </h3>

            <p style={{
              fontSize: 16,
              color: '#e0e6ed',
              marginBottom: 20,
              lineHeight: 1.5
            }}>
              {bot.description}
            </p>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{
                fontSize: 24,
                fontWeight: 900,
                color: '#00c6ff'
              }}>
                {bot.price}€
              </span>

              <button
                onClick={() => ajouterAuPanier(bot)}
                style={{
                  background: 'linear-gradient(90deg, #00c6ff 0%, #0072ff 100%)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  padding: '12px 24px',
                  fontSize: 16,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'transform 0.1s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                🛒 Acheter
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
} 