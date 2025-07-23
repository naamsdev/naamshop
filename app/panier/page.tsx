"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Produit {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  quantity: number;
}

export default function Panier() {
  const router = useRouter();
  const [produits, setProduits] = useState<Produit[]>([]);
  const [methodePaiement, setMethodePaiement] = useState<string>("");
  const [email, setEmail] = useState("");
  const [nom, setNom] = useState("");
  const [supportPremium, setSupportPremium] = useState(false);

  // Charger les produits du panier au démarrage
  useEffect(() => {
    const panierSauvegarde = localStorage.getItem('panierNaamsShop');
    if (panierSauvegarde) {
      try {
        const panierParsed = JSON.parse(panierSauvegarde);
        setProduits(panierParsed);
      } catch (error) {
        console.error('Erreur lors du chargement du panier:', error);
        setProduits([]);
      }
    }
  }, []);

  // Sauvegarder le panier quand il change
  useEffect(() => {
    localStorage.setItem('panierNaamsShop', JSON.stringify(produits));
  }, [produits]);

  // Écouter les messages du catalogue pour ajouter des produits
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'AJOUTER_AU_PANIER') {
        const produit = event.data.produit;
        ajouterAuPanier(produit);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [produits]);

  const ajouterAuPanier = (nouveauProduit: Produit) => {
    setProduits(prevProduits => {
      const produitExistant = prevProduits.find(p => p.id === nouveauProduit.id);
      
      if (produitExistant) {
        // Si le produit existe déjà, augmenter la quantité
        return prevProduits.map(p => 
          p.id === nouveauProduit.id 
            ? { ...p, quantity: p.quantity + 1 }
            : p
        );
      } else {
        // Sinon, ajouter le nouveau produit avec quantité 1
        return [...prevProduits, { ...nouveauProduit, quantity: 1 }];
      }
    });
  };

  const supprimerDuPanier = (id: string) => {
    setProduits(prevProduits => prevProduits.filter(p => p.id !== id));
  };

  const modifierQuantite = (id: string, nouvelleQuantite: number) => {
    if (nouvelleQuantite <= 0) {
      supprimerDuPanier(id);
      return;
    }
    
    setProduits(prevProduits => 
      prevProduits.map(p => 
        p.id === id ? { ...p, quantity: nouvelleQuantite } : p
      )
    );
  };

  const calculerTotal = () => {
    let total = produits.reduce((total, produit) => total + (produit.price * produit.quantity), 0);
    if (supportPremium) total += 20;
    return total;
  };

  const handlePaiement = () => {
    if (!methodePaiement) {
      alert("Veuillez sélectionner une méthode de paiement");
      return;
    }
    if (!email.trim() || !nom.trim()) {
      alert("Veuillez remplir tous les champs");
      return;
    }
    if (produits.length === 0) {
      alert("Votre panier est vide");
      return;
    }

    // Propager l'option supportPremium au checkout (à adapter dans la suite)
    localStorage.setItem('supportPremiumNaamsShop', JSON.stringify(supportPremium));

    // Simulation du processus de paiement
    alert(`Paiement en cours via ${methodePaiement}...\n\nProduits : ${produits.length}\nTotal : ${calculerTotal()}€\n\nRedirection vers le système de paiement...`);
    
    // Vider le panier après paiement
    setProduits([]);
    localStorage.removeItem('panierNaamsShop');
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      right: 0,
      width: '400px',
      height: '100vh',
      background: 'rgba(0, 0, 0, 0.95)',
      backdropFilter: 'blur(10px)',
      borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
      padding: '20px',
      overflowY: 'auto',
      zIndex: 1000,
      color: '#fff'
    }}>
      {/* Header du panier */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
        paddingBottom: '16px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <h2 style={{
          fontSize: '24px',
          fontWeight: 700,
          margin: 0,
          color: '#00c6ff'
        }}>
          🛒 Votre Panier
        </h2>
        <button
          onClick={() => router.push('/catalogue')}
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '8px',
            padding: '8px 16px',
            color: '#fff',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          ← Catalogue
        </button>
      </div>

      {/* Liste des produits */}
      {produits.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '40px 20px',
          color: '#ccc'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🛒</div>
          <p style={{ fontSize: '16px', margin: 0 }}>Votre panier est vide</p>
          <button
            onClick={() => router.push('/catalogue')}
            style={{
              background: 'linear-gradient(90deg, #00c6ff 0%, #0072ff 100%)',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              color: '#fff',
              cursor: 'pointer',
              marginTop: '16px',
              fontSize: '14px'
            }}
          >
            Parcourir le catalogue
          </button>
        </div>
      ) : (
        <>
          <div style={{ marginBottom: '24px' }}>
            {produits.map((produit) => (
              <div
                key={produit.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '12px',
                  padding: '16px',
                  marginBottom: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '12px'
                }}>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: 600,
                    margin: 0,
                    color: '#fff'
                  }}>
                    {produit.name}
                  </h3>
                  <button
                    onClick={() => supprimerDuPanier(produit.id)}
                    style={{
                      background: 'rgba(255, 59, 48, 0.2)',
                      border: '1px solid rgba(255, 59, 48, 0.5)',
                      borderRadius: '6px',
                      padding: '4px 8px',
                      color: '#ff3b30',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    🗑️
                  </button>
                </div>
                
                <p style={{
                  fontSize: '14px',
                  color: '#ccc',
                  margin: '0 0 12px 0',
                  lineHeight: 1.4
                }}>
                  {produit.description}
                </p>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <button
                      onClick={() => modifierQuantite(produit.id, produit.quantity - 1)}
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        borderRadius: '4px',
                        padding: '4px 8px',
                        color: '#fff',
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}
                    >
                      -
                    </button>
                    <span style={{ fontSize: '16px', fontWeight: 600 }}>
                      {produit.quantity}
                    </span>
                    <button
                      onClick={() => modifierQuantite(produit.id, produit.quantity + 1)}
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        borderRadius: '4px',
                        padding: '4px 8px',
                        color: '#fff',
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}
                    >
                      +
                    </button>
                  </div>
                  <span style={{
                    fontSize: '18px',
                    fontWeight: 700,
                    color: '#00c6ff'
                  }}>
                    {produit.price * produit.quantity}€
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Total */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '24px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '8px'
            }}>
              <span style={{ fontSize: '16px', color: '#ccc' }}>Sous-total :</span>
              <span style={{ fontSize: '16px', color: '#fff' }}>{calculerTotal()}€</span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '8px'
            }}>
              <span style={{ fontSize: '16px', color: '#ccc' }}>Frais de service :</span>
              <span style={{ fontSize: '16px', color: '#fff' }}>0€</span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTop: '1px solid rgba(255, 255, 255, 0.2)',
              paddingTop: '8px'
            }}>
              <span style={{ fontSize: '18px', fontWeight: 700, color: '#00c6ff' }}>Total :</span>
              <span style={{ fontSize: '20px', fontWeight: 700, color: '#00c6ff' }}>{calculerTotal()}€</span>
            </div>
          </div>

          {/* Option Support Premium */}
          <div style={{ margin: '24px 0' }}>
            <label style={{ fontWeight: 600 }}>
              <input
                type="checkbox"
                checked={supportPremium}
                onChange={e => setSupportPremium(e.target.checked)}
                style={{ marginRight: 8 }}
              />
              Support Premium (+20€) — Suivi prioritaire & maintenance longue durée
            </label>
          </div>

          {/* Informations client */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '24px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <h3 style={{
              fontSize: '16px',
              fontWeight: 600,
              margin: '0 0 16px 0',
              color: '#fff'
            }}>
              Informations de contact
            </h3>
            
            <div style={{ marginBottom: '12px' }}>
              <label style={{
                display: 'block',
                marginBottom: '4px',
                fontSize: '14px',
                color: '#ccc'
              }}>
                Nom complet :
              </label>
              <input
                type="text"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                  fontSize: '14px'
                }}
                placeholder="Votre nom complet"
              />
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{
                display: 'block',
                marginBottom: '4px',
                fontSize: '14px',
                color: '#ccc'
              }}>
                Email :
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                  fontSize: '14px'
                }}
                placeholder="votre@email.com"
              />
            </div>
          </div>

          {/* Méthodes de paiement */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '24px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <h3 style={{
              fontSize: '16px',
              fontWeight: 600,
              margin: '0 0 16px 0',
              color: '#fff'
            }}>
              Méthode de paiement
            </h3>
            
            <div style={{ marginBottom: '12px' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                padding: '8px',
                borderRadius: '6px',
                background: methodePaiement === 'paypal' ? 'rgba(0, 123, 255, 0.2)' : 'transparent',
                border: methodePaiement === 'paypal' ? '1px solid rgba(0, 123, 255, 0.5)' : '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <input
                  type="radio"
                  name="paiement"
                  value="paypal"
                  checked={methodePaiement === 'paypal'}
                  onChange={(e) => setMethodePaiement(e.target.value)}
                  style={{ marginRight: '8px' }}
                />
                <span style={{ fontSize: '14px', color: '#fff' }}>PayPal</span>
              </label>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                padding: '8px',
                borderRadius: '6px',
                background: methodePaiement === 'carte' ? 'rgba(0, 123, 255, 0.2)' : 'transparent',
                border: methodePaiement === 'carte' ? '1px solid rgba(0, 123, 255, 0.5)' : '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <input
                  type="radio"
                  name="paiement"
                  value="carte"
                  checked={methodePaiement === 'carte'}
                  onChange={(e) => setMethodePaiement(e.target.value)}
                  style={{ marginRight: '8px' }}
                />
                <span style={{ fontSize: '14px', color: '#fff' }}>Carte de crédit</span>
              </label>
            </div>
          </div>

          {/* Bouton de paiement */}
          <button
            onClick={handlePaiement}
            style={{
              background: 'linear-gradient(90deg, #00c6ff 0%, #0072ff 100%)',
              border: 'none',
              borderRadius: '12px',
              padding: '16px',
              color: '#fff',
              cursor: 'pointer',
              width: '100%',
              fontSize: '16px',
              fontWeight: 600,
              marginBottom: '16px'
            }}
          >
            💳 Payer {calculerTotal()}€
          </button>
        </>
      )}
    </div>
  );
} 