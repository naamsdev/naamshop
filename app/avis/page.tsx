"use client";
import { useState, useEffect } from "react";

interface Avis {
  id: number;
  nom: string;
  note: number;
  commentaire: string;
  date: string;
}

export default function Avis() {
  const [note, setNote] = useState(0);
  const [nom, setNom] = useState("");
  const [commentaire, setCommentaire] = useState("");
  const [tempsRestant, setTempsRestant] = useState(0);
  const [avis, setAvis] = useState<Avis[]>([]);

  // Charger les avis sauvegardés au démarrage
  useEffect(() => {
    // Vider le localStorage pour forcer le rechargement avec les nouvelles dates
    localStorage.removeItem('avisNaamsShop');
    
    const avisSauvegardes = localStorage.getItem('avisNaamsShop');
    if (avisSauvegardes) {
      try {
        const avisParsed = JSON.parse(avisSauvegardes);
        setAvis(avisParsed);
      } catch (error) {
        console.error('Erreur lors du chargement des avis:', error);
        // Si erreur de parsing, utiliser les avis par défaut
        setAvis([
          {
            id: 1,
            nom: "Alexandre",
            note: 5,
            commentaire: "Excellent service ! Mon bot Discord est parfaitement fonctionnel et le support est très réactif. Je recommande vivement !",
            date: "05/07/2025"
          },
          {
            id: 2,
            nom: "Marie",
            note: 5,
            commentaire: "Très satisfaite de mon bot de modération. Livraison rapide et code propre. NaamsShop est vraiment professionnel.",
            date: "13/07/2025"
          },
          {
            id: 3,
            nom: "Thomas",
            note: 4,
            commentaire: "Bon bot d'économie, quelques petits ajustements nécessaires mais le support a été très à l'écoute. Merci !",
            date: "16/07/2025"
          }
        ]);
      }
    } else {
      // Première visite : utiliser les avis par défaut
      setAvis([
        {
          id: 1,
          nom: "Alexandre",
          note: 5,
          commentaire: "Excellent service ! Mon bot Discord est parfaitement fonctionnel et le support est très réactif. Je recommande vivement !",
          date: "05/07/2025"
        },
        {
          id: 2,
          nom: "Marie",
          note: 5,
          commentaire: "Très satisfaite de mon bot de modération. Livraison rapide et code propre. NaamsShop est vraiment professionnel.",
          date: "13/07/2025"
        },
        {
          id: 3,
          nom: "Thomas",
          note: 4,
          commentaire: "Bon bot d'économie, quelques petits ajustements nécessaires mais le support a été très à l'écoute. Merci !",
          date: "16/07/2025"
        }
      ]);
    }
  }, []);

  // Sauvegarder les avis quand ils changent
  useEffect(() => {
    if (avis.length > 0) {
      localStorage.setItem('avisNaamsShop', JSON.stringify(avis));
    }
  }, [avis]);

  // Vérifier le temps restant au chargement de la page
  useEffect(() => {
    const dernierePublication = localStorage.getItem('dernierePublicationAvis');
    if (dernierePublication) {
      const tempsEcoule = Date.now() - parseInt(dernierePublication);
      const tempsAttente = 30 * 60 * 1000; // 30 minutes en millisecondes
      const tempsRestantCalcul = Math.max(0, tempsAttente - tempsEcoule);
      
      if (tempsRestantCalcul > 0) {
        setTempsRestant(tempsRestantCalcul);
      }
    }
  }, []);

  // Mettre à jour le temps restant toutes les secondes
  useEffect(() => {
    if (tempsRestant > 0) {
      const interval = setInterval(() => {
        setTempsRestant(prev => {
          if (prev <= 1000) {
            return 0;
          }
          return prev - 1000;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [tempsRestant]);

  const formatTemps = (millisecondes: number) => {
    const minutes = Math.floor(millisecondes / 60000);
    const secondes = Math.floor((millisecondes % 60000) / 1000);
    return `${minutes}:${secondes.toString().padStart(2, '0')}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (tempsRestant > 0) {
      alert(`Vous devez attendre encore ${formatTemps(tempsRestant)} avant de pouvoir publier un nouvel avis.`);
      return;
    }

    if (note === 0 || !nom.trim() || !commentaire.trim()) {
      alert("Veuillez remplir tous les champs et donner une note");
      return;
    }

    const nouvelAvis: Avis = {
      id: Date.now(),
      nom: nom.trim(),
      note,
      commentaire: commentaire.trim(),
      date: new Date().toLocaleDateString('fr-FR')
    };

    setAvis([nouvelAvis, ...avis]);
    setNote(0);
    setNom("");
    setCommentaire("");
    
    // Enregistrer le timestamp de la publication
    localStorage.setItem('dernierePublicationAvis', Date.now().toString());
    setTempsRestant(30 * 60 * 1000); // 30 minutes
  };

  const renderStars = (note: number, interactive = false, onStarClick?: (starIndex: number) => void) => {
    return (
      <div style={{ display: 'flex', gap: '4px' }}>
        {[1, 2, 3, 4, 5].map((starIndex) => (
          <span
            key={starIndex}
            onClick={() => interactive && onStarClick && onStarClick(starIndex)}
            style={{
              cursor: interactive ? 'pointer' : 'default',
              fontSize: '24px',
              color: starIndex <= note ? '#FFD700' : '#ccc',
              transition: 'color 0.2s'
            }}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <main style={{
      minHeight: '80vh',
      padding: '40px 16px',
      maxWidth: 800,
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
        Avis Clients
      </h1>

      {/* Formulaire d'avis */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 16,
        padding: 32,
        marginBottom: 40,
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <h2 style={{
          fontSize: 24,
          fontWeight: 700,
          marginBottom: 24,
          textAlign: 'center',
          color: '#fff'
        }}>
          Rédiger un avis
        </h2>

        {tempsRestant > 0 && (
          <div style={{
            background: 'rgba(255, 193, 7, 0.2)',
            border: '1px solid rgba(255, 193, 7, 0.5)',
            borderRadius: 8,
            padding: '12px 16px',
            marginBottom: 20,
            textAlign: 'center'
          }}>
            <span style={{ color: '#FFC107', fontWeight: 600 }}>
              ⏰ Vous pourrez publier un nouvel avis dans : {formatTemps(tempsRestant)}
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 20 }}>
            <label style={{
              display: 'block',
              marginBottom: 8,
              fontSize: 16,
              fontWeight: 600,
              color: '#e0e6ed'
            }}>
              Votre note :
            </label>
            {renderStars(note, true, setNote)}
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{
              display: 'block',
              marginBottom: 8,
              fontSize: 16,
              fontWeight: 600,
              color: '#e0e6ed'
            }}>
              Votre nom :
            </label>
            <input
              type="text"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: 8,
                border: '1px solid rgba(255, 255, 255, 0.3)',
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#fff',
                fontSize: 16
              }}
              placeholder="Votre nom ou pseudo"
              disabled={tempsRestant > 0}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{
              display: 'block',
              marginBottom: 8,
              fontSize: 16,
              fontWeight: 600,
              color: '#e0e6ed'
            }}>
              Votre commentaire :
            </label>
            <textarea
              value={commentaire}
              onChange={(e) => setCommentaire(e.target.value)}
              rows={4}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: 8,
                border: '1px solid rgba(255, 255, 255, 0.3)',
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#fff',
                fontSize: 16,
                resize: 'vertical'
              }}
              placeholder="Partagez votre expérience avec NaamsShop..."
              disabled={tempsRestant > 0}
            />
          </div>

          <button
            type="submit"
            disabled={tempsRestant > 0}
            style={{
              background: tempsRestant > 0 
                ? 'rgba(255, 255, 255, 0.3)' 
                : 'linear-gradient(90deg, #00c6ff 0%, #0072ff 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '14px 32px',
              fontSize: 16,
              fontWeight: 600,
              cursor: tempsRestant > 0 ? 'not-allowed' : 'pointer',
              width: '100%',
              transition: 'transform 0.1s',
              opacity: tempsRestant > 0 ? 0.6 : 1
            }}
          >
            {tempsRestant > 0 ? 'Temps d\'attente...' : 'Publier mon avis'}
          </button>
        </form>
      </div>

      {/* Liste des avis */}
      <div>
        <h2 style={{
          fontSize: 24,
          fontWeight: 700,
          marginBottom: 24,
          textAlign: 'center',
          color: '#26acd4ff'
        }}>
          Avis des clients ({avis.length})
        </h2>

        {avis.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '40px',
            color: '#ccc',
            fontSize: 18
          }}>
            Aucun avis pour le moment. Soyez le premier à laisser un avis !
          </div>
        ) : (
          avis.map((avisItem) => (
            <div
              key={avisItem.id}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: 12,
                padding: 24,
                marginBottom: 16,
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 12
              }}>
                <h3 style={{
                  fontSize: 18,
                  fontWeight: 600,
                  color: '#00c6ff',
                  margin: 0
                }}>
                  {avisItem.nom}
                </h3>
                <span style={{
                  fontSize: 14,
                  color: '#ccc'
                }}>
                  {avisItem.date}
                </span>
              </div>

              <div style={{ marginBottom: 12 }}>
                {renderStars(avisItem.note)}
              </div>

              <p style={{
                fontSize: 16,
                color: '#e0e6ed',
                lineHeight: 1.5,
                margin: 0
              }}>
                {avisItem.commentaire}
              </p>
            </div>
          ))
        )}
      </div>
    </main>
  );
} 