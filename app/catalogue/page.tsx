"use client";
import { useState, useEffect } from "react";
import Image from 'next/image';
import styles from '../page.module.css';

interface Bot {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  quantity?: number;
}

export default function Catalogue() {
  const [bots, setBots] = useState<Bot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/bots')
      .then(res => {
        if (!res.ok) {
          throw new Error(`Erreur HTTP: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setBots(data);
        } else {
          setBots([]);
        }
        setLoading(false);
      })
      .catch(() => {
        setBots([]);
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
    <main className={styles['catalogue-modern-bg']}>
      <h1 className={styles['catalogue-modern-title']}>
        Catalogue des Bots
      </h1>
      <div className={styles['catalogue-modern-grid']}>
        {bots.map((bot) => (
          <div key={bot.id} className={styles['catalogue-modern-card']}>
            <div className={styles['catalogue-modern-img-bg']}>
              {bot.image && (
                <Image
                  src={bot.image}
                  alt={bot.name}
                  className={styles['catalogue-modern-img']}
                  width={90}
                  height={90}
                />
              )}
            </div>
            <h2 className={styles['catalogue-modern-card-title']}>{bot.name}</h2>
            <p className={styles['catalogue-modern-card-desc']}>{bot.description}</p>
            <div className={styles['catalogue-modern-card-footer']}>
              <span className={styles['catalogue-modern-card-price']}>{bot.price.toFixed(2)}€</span>
              <button
                className={styles['catalogue-modern-card-btn']}
                onClick={() => ajouterAuPanier(bot)}
              >
                <span className={styles['catalogue-modern-btn-icon']}>🛒</span> Acheter
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
} 