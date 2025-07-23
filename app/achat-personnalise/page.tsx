"use client";

import { useState } from "react";

export default function AchatPersonnalise() {
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [produit, setProduit] = useState("");
  const [description, setDescription] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      const res = await fetch("/api/ticket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nom, email, produit, description, type: "achat-personnalise" })
      });
      if (res.ok) {
        setSuccess(true);
        setNom(""); setEmail(""); setProduit(""); setDescription("");
      } else {
        setError("Erreur lors de l'envoi. Réessayez.");
      }
    } catch {
      setError("Erreur réseau. Réessayez.");
    }
    setLoading(false);
  };

  return (
    <main style={{ maxWidth: 500, margin: "40px auto", padding: 24, color: "#fff" }}>
      <h1 style={{ color: "#00c6ff", fontSize: 32, fontWeight: 900, marginBottom: 18, textAlign: 'center' }}>Achat personnalisé</h1>
      <p style={{ marginBottom: 18, fontSize: 17, textAlign: 'center', lineHeight: 1.6 }}>
        Vous souhaitez un <b>bot Discord unique</b>, un <b>script FiveM sur-mesure</b> ou un <b>service de montage vidéo</b> adapté à vos besoins&nbsp;?<br />
        Remplissez ce formulaire pour nous décrire précisément votre projet.<br />
        <span style={{ color: '#00ff99', fontWeight: 600 }}>Notre équipe vous répondra rapidement par email pour discuter de votre demande et établir un devis personnalisé.</span>
      </p>
      <div style={{
        background: 'rgba(255,255,255,0.08)',
        borderLeft: '5px solid #00c6ff',
        borderRadius: 8,
        padding: '14px 18px',
        marginBottom: 18,
        fontSize: 15,
        color: '#ffe082',
        fontWeight: 500
      }}>
        ⚠️ Merci de ne pas abuser de cette fonctionnalité.<br />
        Ce service est réservé à la création de bots entièrement personnalisés, au développement spécifique pour serveurs FiveM, ou à des montages vidéo (durée maximale&nbsp;: <b>1h00</b>).
      </div>
      <p style={{ marginBottom: 24, fontSize: 15, color: '#e0e6ed', textAlign: 'center' }}>
        <b>Soyez le plus précis possible</b> dans votre description pour un traitement rapide et efficace&nbsp;!
      </p>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <input
          type="text"
          placeholder="Nom"
          value={nom}
          onChange={e => setNom(e.target.value)}
          required
          style={{ padding: 12, borderRadius: 8, border: "none", fontSize: 16 }}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={{ padding: 12, borderRadius: 8, border: "none", fontSize: 16 }}
        />
        <input
          type="text"
          placeholder="Nom du produit personnalisé"
          value={produit}
          onChange={e => setProduit(e.target.value)}
          required
          style={{ padding: 12, borderRadius: 8, border: "none", fontSize: 16 }}
        />
        <textarea
          placeholder="Description détaillée du produit"
          value={description}
          onChange={e => setDescription(e.target.value)}
          required
          rows={5}
          style={{ padding: 12, borderRadius: 8, border: "none", fontSize: 16 }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            background: "linear-gradient(90deg, #00c6ff 0%, #0072ff 100%)",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "14px 0",
            fontSize: 18,
            fontWeight: 700,
            cursor: loading ? "not-allowed" : "pointer"
          }}
        >
          {loading ? "Envoi en cours..." : "Envoyer la demande"}
        </button>
      </form>
      {success && <p style={{ color: "#00ff99", marginTop: 16 }}>Demande envoyée ! Nous te contacterons rapidement.</p>}
      {error && <p style={{ color: "#ff4d4f", marginTop: 16 }}>{error}</p>}
    </main>
  );
} 