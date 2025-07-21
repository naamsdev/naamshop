"use client";

import { useState, useEffect, useCallback } from 'react';

interface Produit {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  quantity?: number;
}

interface Commande {
  id: string;
  nom: string;
  email: string;
  moyenPaiement: string;
  produits: Produit[];
  prix: number;
  date: string;
}

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [commandes, setCommandes] = useState<Commande[]>([]);
  const [produits, setProduits] = useState<Produit[]>([]);
  const [stats, setStats] = useState({
    vues: 0,
    totalCommandes: 0,
    gains24h: 0,
    gains7j: 0,
    gains30j: 0,
    gains1an: 0,
    gainsTotal: 0,
    produitPlusVendu: ''
  });
  const [config, setConfig] = useState({
    admin: { username: '', password: '' },
    email: { user: '', password: '', defaultSubject: '', defaultMessage: '' }
  });

  // Authentification simple (en production, utilise une vraie authentification)
  const handleLogin = async () => {
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const data = await response.json();
      if (data.success) {
        setIsAuthenticated(true);
        localStorage.setItem('adminAuth', 'true');
      }
    } catch {
    }
  };

  const chargerDonnees = useCallback(async () => {
    // Charger les commandes depuis localStorage
    const commandesStorage = localStorage.getItem('commandes') || '[]';
    const commandesData = JSON.parse(commandesStorage);
    setCommandes(commandesData);

    // Charger les produits depuis l'API
    try {
      const response = await fetch('/api/bots');
      const produitsData = await response.json();
      setProduits(produitsData);
    } catch {
      console.error('Erreur chargement produits:');
    }

    // Calculer les statistiques
    calculerStats(commandesData);
  }, []);

  useEffect(() => {
    const auth = localStorage.getItem('adminAuth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
    chargerDonnees();
  }, [chargerDonnees]);

  const calculerStats = (commandesData: Commande[]) => {
    const maintenant = new Date();
    const vues = parseInt(localStorage.getItem('vuesSite') || '0');
    
    const gains24h = commandesData
      .filter(c => new Date(c.date) > new Date(maintenant.getTime() - 24 * 60 * 60 * 1000))
      .reduce((sum, c) => sum + c.prix, 0);

    const gains7j = commandesData
      .filter(c => new Date(c.date) > new Date(maintenant.getTime() - 7 * 24 * 60 * 60 * 1000))
      .reduce((sum, c) => sum + c.prix, 0);

    const gains30j = commandesData
      .filter(c => new Date(c.date) > new Date(maintenant.getTime() - 30 * 24 * 60 * 60 * 1000))
      .reduce((sum, c) => sum + c.prix, 0);

    const gains1an = commandesData
      .filter(c => new Date(c.date) > new Date(maintenant.getTime() - 365 * 24 * 60 * 60 * 1000))
      .reduce((sum, c) => sum + c.prix, 0);

    const gainsTotal = commandesData.reduce((sum, c) => sum + c.prix, 0);

    // Produit le plus vendu
    const ventesParProduit: { [key: string]: number } = {};
    commandesData.forEach(commande => {
      commande.produits.forEach((produit: Produit) => {
        ventesParProduit[produit.name] = (ventesParProduit[produit.name] || 0) + (produit.quantity || 1); // Assuming quantity is 1 if not specified
      });
    });

    const produitPlusVendu = Object.keys(ventesParProduit).reduce((a, b) => 
      ventesParProduit[a] > ventesParProduit[b] ? a : b, '');

    setStats({
      vues,
      totalCommandes: commandesData.length,
      gains24h,
      gains7j,
      gains30j,
      gains1an,
      gainsTotal,
      produitPlusVendu
    });
  };

  if (!isAuthenticated) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Effet glassmorphism */}
        <div style={{
          background: 'rgba(255,255,255,0.15)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderRadius: '18px',
          border: '1px solid rgba(255,255,255,0.18)',
          padding: '48px 36px',
          minWidth: 350,
          maxWidth: '90vw',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          animation: 'fadeIn 0.7s'
        }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>
            <span role="img" aria-label="lock">🔒</span>
          </div>
          <h1 style={{
            textAlign: 'center',
            marginBottom: '30px',
            color: '#222',
            fontWeight: 800,
            fontSize: 28,
            letterSpacing: 1
          }}>
            Panel Administrateur
          </h1>
          <div style={{ width: '100%', marginBottom: 18, position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '14px 44px 14px 16px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: 16,
                background: 'rgba(255,255,255,0.7)',
                outline: 'none',
                color: '#222',
                fontWeight: 500
              }}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
            />
            <span
              onClick={() => setShowPassword(v => !v)}
              style={{
                position: 'absolute',
                right: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                cursor: 'pointer',
                color: '#888',
                fontSize: 20
              }}
              title={showPassword ? 'Masquer' : 'Afficher'}
            >
              {showPassword ? '🙈' : '👁️'}
            </span>
          </div>
          <button
            onClick={handleLogin}
            style={{
              width: '100%',
              padding: '14px',
              background: 'linear-gradient(90deg, #00c6ff 0%, #0072ff 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '18px',
              fontWeight: 700,
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              transition: 'background 0.2s'
            }}
          >
            Se connecter
          </button>
        </div>
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: 0,
      margin: 0,
      fontFamily: 'Inter, Arial, sans-serif',
      overflowX: 'hidden',
    }}>
      {/* Header modernisé */}
      <div style={{
        background: 'rgba(255,255,255,0.12)',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.17)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        borderRadius: '0 0 18px 18px',
        borderBottom: '1px solid rgba(255,255,255,0.18)',
        padding: '24px 32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 32, color: '#0072ff' }}>🛡️</span>
          <h1 style={{
            margin: 0,
            fontWeight: 900,
            fontSize: 28,
            letterSpacing: 1,
            color: '#222',
            textShadow: '0 2px 8px rgba(0,0,0,0.07)'
          }}>
            Panel Administrateur NaamsShop
          </h1>
        </div>
        <button
          onClick={() => {
            setIsAuthenticated(false);
            localStorage.removeItem('adminAuth');
          }}
          style={{
            background: 'linear-gradient(90deg, #00c6ff 0%, #0072ff 100%)',
            border: 'none',
            color: 'white',
            padding: '10px 28px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 700,
            fontSize: 16,
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            transition: 'background 0.2s',
            marginLeft: 24
          }}
        >
          Déconnexion
        </button>
      </div>

      {/* Navigation modernisée */}
      <div style={{
        background: 'rgba(255,255,255,0.10)',
        padding: '18px 32px',
        borderBottom: '1px solid rgba(255,255,255,0.13)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 18,
        position: 'sticky',
        top: 80,
        zIndex: 99
      }}>
        {[
          { key: 'dashboard', label: '📊 Dashboard' },
          { key: 'commandes', label: '📋 Commandes' },
          { key: 'catalogue', label: '🛍️ Catalogue' },
          { key: 'emails', label: '✉️ Emails' },
          { key: 'admin', label: '⚙️ Espace Administrateur' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: '12px 28px',
              background: activeTab === tab.key ? 'linear-gradient(90deg, #00c6ff 0%, #0072ff 100%)' : 'rgba(255,255,255,0.18)',
              color: activeTab === tab.key ? 'white' : '#222',
              border: 'none',
              borderRadius: '24px',
              fontWeight: 700,
              fontSize: 16,
              cursor: 'pointer',
              boxShadow: activeTab === tab.key ? '0 2px 8px rgba(0,123,255,0.13)' : 'none',
              transition: 'all 0.2s',
              marginLeft: tab.key === 'admin' ? 32 : 0
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Contenu principal avec animation et effet glassmorphism */}
      <div style={{
        padding: '32px 0',
        minHeight: 'calc(100vh - 180px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        background: 'none',
      }}>
        <div style={{
          width: '100%',
          maxWidth: 1200,
          background: 'rgba(255,255,255,0.13)',
          borderRadius: 18,
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.13)',
          padding: '32px 24px',
          animation: 'fadeInSection 0.7s',
          margin: '0 16px',
          overflowX: 'auto',
        }}>
          {activeTab === 'dashboard' && <Dashboard stats={stats} />}
          {activeTab === 'commandes' && <Commandes commandes={commandes} />}
          {activeTab === 'catalogue' && <Catalogue produits={produits} onUpdate={chargerDonnees} />}
          {activeTab === 'admin' && <AdminConfig config={config} setConfig={setConfig} />}
          {/* Ajoute ici Emails si tu veux */}
        </div>
      </div>
      <style>{`
        ::-webkit-scrollbar { width: 8px; background: rgba(0,0,0,0.04); }
        ::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.13); border-radius: 8px; }
        @keyframes fadeInSection {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

interface Stats {
  vues: number;
  totalCommandes: number;
  gains24h: number;
  gains7j: number;
  gains30j: number;
  gains1an: number;
  gainsTotal: number;
  produitPlusVendu: string;
}
function Dashboard({ stats }: { stats: Stats }) {
  return (
    <div>
      <h2 style={{ marginBottom: '30px', color: '#333' }}>📊 Dashboard</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
          <h3 style={{ color: '#0072ff', marginBottom: '10px' }}>👁️ Vues du site</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.vues}</p>
        </div>
        
        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
          <h3 style={{ color: '#0072ff', marginBottom: '10px' }}>📦 Total commandes</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.totalCommandes}</p>
        </div>
        
        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
          <h3 style={{ color: '#0072ff', marginBottom: '10px' }}>💰 Gains 24h</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.gains24h}€</p>
        </div>
        
        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
          <h3 style={{ color: '#0072ff', marginBottom: '10px' }}>💰 Gains 7 jours</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.gains7j}€</p>
        </div>
        
        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
          <h3 style={{ color: '#0072ff', marginBottom: '10px' }}>💰 Gains 30 jours</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.gains30j}€</p>
        </div>
        
        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
          <h3 style={{ color: '#0072ff', marginBottom: '10px' }}>💰 Gains 1 an</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.gains1an}€</p>
        </div>
        
        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
          <h3 style={{ color: '#0072ff', marginBottom: '10px' }}>💰 Gains totaux</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.gainsTotal}€</p>
        </div>
        
        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
          <h3 style={{ color: '#0072ff', marginBottom: '10px' }}>🏆 Produit le plus vendu</h3>
          <p style={{ fontSize: '18px', fontWeight: 'bold' }}>{stats.produitPlusVendu || 'Aucun'}</p>
        </div>
      </div>
    </div>
  );
}

// Composant Commandes
function Commandes({ commandes }: { commandes: Commande[] }) {
  return (
    <div>
      <h2 style={{ marginBottom: '30px', color: '#333' }}>📋 Commandes</h2>
      
      <div style={{ background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8f9fa' }}>
              <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #eee' }}>ID</th>
              <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #eee' }}>Nom</th>
              <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #eee' }}>Email</th>
              <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #eee' }}>Paiement</th>
              <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #eee' }}>Produits</th>
              <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #eee' }}>Prix</th>
              <th style={{ padding: '15px', textAlign: 'left', borderBottom: '1px solid #eee' }}>Date</th>
            </tr>
          </thead>
          <tbody>
            {commandes.map((commande) => (
              <tr key={commande.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '15px' }}>{commande.id}</td>
                <td style={{ padding: '15px' }}>{commande.nom}</td>
                <td style={{ padding: '15px' }}>{commande.email}</td>
                <td style={{ padding: '15px' }}>{commande.moyenPaiement}</td>
                <td style={{ padding: '15px' }}>
                  {commande.produits.map((p: Produit) => p.name).join(', ')}
                </td>
                <td style={{ padding: '15px', fontWeight: 'bold' }}>{commande.prix}€</td>
                <td style={{ padding: '15px' }}>{new Date(commande.date).toLocaleDateString('fr-FR')}</td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {commandes.length === 0 && (
          <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
            Aucune commande pour le moment
          </div>
        )}
      </div>
    </div>
  );
}

// Composant Catalogue
function Catalogue({ produits, onUpdate }: { produits: Produit[], onUpdate: () => void }) {
  const [editingProduct, setEditingProduct] = useState<Produit | null>(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: 0,
    image: ''
  });

  const handleSave = async (produit: Produit) => {
    try {
      const response = await fetch('/api/bots', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(produit)
      });
      
      if (response.ok) {
        setEditingProduct(null);
        onUpdate();
      }
    } catch {
      console.error('Erreur mise à jour:');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      try {
        const response = await fetch(`/api/bots/${id}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          onUpdate();
        }
      } catch {
        console.error('Erreur suppression:');
      }
    }
  };

  const handleAdd = async () => {
    try {
      const response = await fetch('/api/bots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct)
      });
      
      if (response.ok) {
        setNewProduct({ name: '', description: '', price: 0, image: '' });
        onUpdate();
      }
    } catch {
      console.error('Erreur ajout:');
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: '30px', color: '#333' }}>🛍️ Gestion du Catalogue</h2>
      
      {/* Ajouter un produit */}
      <div style={{ background: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <h3 style={{ marginBottom: '20px', color: '#333' }}>➕ Ajouter un produit</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
          <input
            type="text"
            placeholder="Nom du bot"
            value={newProduct.name}
            onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
            style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }}
          />
          <input
            type="text"
            placeholder="Description"
            value={newProduct.description}
            onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
            style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }}
          />
          <input
            type="number"
            placeholder="Prix"
            value={newProduct.price}
            onChange={(e) => setNewProduct({...newProduct, price: parseFloat(e.target.value)})}
            style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }}
          />
          <input
            type="text"
            placeholder="URL image"
            value={newProduct.image}
            onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
            style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }}
          />
          <button
            onClick={handleAdd}
            style={{
              padding: '10px 20px',
              background: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Ajouter
          </button>
        </div>
      </div>

      {/* Liste des produits */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        {produits.map((produit) => (
          <div key={produit.id} style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            {editingProduct?.id === produit.id ? (
              <div>
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                  style={{ width: '100%', padding: '8px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
                <textarea
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                  style={{ width: '100%', padding: '8px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '4px', height: '60px' }}
                />
                <input
                  type="number"
                  value={editingProduct.price}
                  onChange={(e) => setEditingProduct({...editingProduct, price: parseFloat(e.target.value)})}
                  style={{ width: '100%', padding: '8px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
                <input
                  type="text"
                  value={editingProduct.image}
                  onChange={(e) => setEditingProduct({...editingProduct, image: e.target.value})}
                  style={{ width: '100%', padding: '8px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => handleSave(editingProduct)}
                    style={{
                      padding: '8px 16px',
                      background: '#0072ff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Sauvegarder
                  </button>
                  <button
                    onClick={() => setEditingProduct(null)}
                    style={{
                      padding: '8px 16px',
                      background: '#6c757d',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Annuler
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <h3 style={{ marginBottom: '10px', color: '#333' }}>{produit.name}</h3>
                <p style={{ marginBottom: '10px', color: '#666' }}>{produit.description}</p>
                <p style={{ marginBottom: '10px', fontWeight: 'bold', color: '#0072ff' }}>{produit.price}€</p>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => setEditingProduct(produit)}
                    style={{
                      padding: '8px 16px',
                      background: '#ffc107',
                      color: '#333',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(produit.id)}
                    style={{
                      padding: '8px 16px',
                      background: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 

interface AdminConfigProps {
  config: {
    admin: { username: string; password: string };
    email: { user: string; password: string; defaultSubject: string; defaultMessage: string };
  };
  setConfig: (config: { admin: { username: string; password: string }; email: { user: string; password: string; defaultSubject: string; defaultMessage: string } }) => void;
}
function AdminConfig({ config, setConfig }: AdminConfigProps) {
  return (
    <div>
      <h2 style={{ marginBottom: '30px', color: '#333' }}>⚙️ Espace Administrateur</h2>
      <div style={{ background: 'white', padding: '20px', borderRadius: '8px', maxWidth: 500 }}>
        <h3>Identifiants Admin</h3>
        <input type="text" placeholder="Nom d'utilisateur" value={config.admin.username} onChange={e => setConfig({ ...config, admin: { ...config.admin, username: e.target.value } })} style={{ width: '100%', marginBottom: 10 }} />
        <input type="password" placeholder="Mot de passe" value={config.admin.password} onChange={e => setConfig({ ...config, admin: { ...config.admin, password: e.target.value } })} style={{ width: '100%', marginBottom: 20 }} />
        <h3>Configuration Email</h3>
        <input type="email" placeholder="Adresse d'envoi" value={config.email.user} onChange={e => setConfig({ ...config, email: { ...config.email, user: e.target.value } })} style={{ width: '100%', marginBottom: 10 }} />
        <input type="password" placeholder="Mot de passe d'application" value={config.email.password} onChange={e => setConfig({ ...config, email: { ...config.email, password: e.target.value } })} style={{ width: '100%', marginBottom: 10 }} />
        <input type="text" placeholder="Objet par défaut" value={config.email.defaultSubject} onChange={e => setConfig({ ...config, email: { ...config.email, defaultSubject: e.target.value } })} style={{ width: '100%', marginBottom: 10 }} />
        <textarea placeholder="Message par défaut" value={config.email.defaultMessage} onChange={e => setConfig({ ...config, email: { ...config.email, defaultMessage: e.target.value } })} style={{ width: '100%', marginBottom: 20 }} />
        <button style={{ width: '100%', background: '#0072ff', color: 'white', padding: 12, border: 'none', borderRadius: 6, fontWeight: 600, fontSize: 16 }}>Sauvegarder</button>
      </div>
    </div>
  );
} 