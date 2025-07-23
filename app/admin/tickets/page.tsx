"use client";

import { useEffect, useState } from "react";

interface Ticket {
  id: string;
  nom: string;
  email: string;
  produit: string;
  description: string;
  type: string;
  date: string;
}

export default function AdminTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [auth, setAuth] = useState(false);
  const [inputPwd, setInputPwd] = useState("");
  const [pwdError, setPwdError] = useState("");
  const [adminPwd, setAdminPwd] = useState<string | null>(null);

  // Récupérer le mot de passe admin depuis l'API
  useEffect(() => {
    fetch("/api/admin-config")
      .then(res => res.json())
      .then(data => setAdminPwd(data.password || ""));
  }, []);

  useEffect(() => {
    if (!auth) return;
    setLoading(true);
    fetch("/api/ticket-list")
      .then(res => {
        if (!res.ok) throw new Error("Erreur HTTP " + res.status);
        return res.json();
      })
      .then(data => {
        setTickets(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setError("Impossible de charger les tickets.");
        setLoading(false);
      });
  }, [auth]);

  const handlePwd = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputPwd === adminPwd) {
      setAuth(true);
      setPwdError("");
    } else {
      setPwdError("Mot de passe incorrect");
    }
  };

  if (adminPwd === null) {
    return <main style={{ color: '#fff', textAlign: 'center', marginTop: 80 }}>Chargement...</main>;
  }

  if (!auth) {
    return (
      <main style={{ maxWidth: 400, margin: "80px auto", padding: 24, color: "#fff" }}>
        <h1 style={{ color: "#00c6ff", fontSize: 28, fontWeight: 900, marginBottom: 24 }}>Accès admin</h1>
        <form onSubmit={handlePwd} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <input
            type="password"
            placeholder="Mot de passe admin"
            value={inputPwd}
            onChange={e => setInputPwd(e.target.value)}
            style={{ padding: 12, borderRadius: 8, border: "none", fontSize: 16 }}
          />
          <button
            type="submit"
            style={{
              background: "linear-gradient(90deg, #00c6ff 0%, #0072ff 100%)",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "14px 0",
              fontSize: 18,
              fontWeight: 700,
              cursor: "pointer"
            }}
          >
            Se connecter
          </button>
        </form>
        {pwdError && <p style={{ color: "#ff4d4f", marginTop: 16 }}>{pwdError}</p>}
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 900, margin: "40px auto", padding: 24, color: "#fff" }}>
      <h1 style={{ color: "#00c6ff", fontSize: 32, fontWeight: 900, marginBottom: 24 }}>Tickets reçus</h1>
      {loading && <p>Chargement...</p>}
      {error && <p style={{ color: "#ff4d4f" }}>{error}</p>}
      {!loading && !error && (
        <table style={{ width: "100%", borderCollapse: "collapse", background: "rgba(255,255,255,0.03)" }}>
          <thead>
            <tr style={{ background: "#222" }}>
              <th style={{ padding: 8, border: "1px solid #333" }}>Date</th>
              <th style={{ padding: 8, border: "1px solid #333" }}>Nom</th>
              <th style={{ padding: 8, border: "1px solid #333" }}>Email</th>
              <th style={{ padding: 8, border: "1px solid #333" }}>Produit</th>
              <th style={{ padding: 8, border: "1px solid #333" }}>Description</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map(ticket => (
              <tr key={ticket.id}>
                <td style={{ padding: 8, border: "1px solid #333", fontSize: 13 }}>{new Date(ticket.date).toLocaleString()}</td>
                <td style={{ padding: 8, border: "1px solid #333" }}>{ticket.nom}</td>
                <td style={{ padding: 8, border: "1px solid #333" }}>{ticket.email}</td>
                <td style={{ padding: 8, border: "1px solid #333" }}>{ticket.produit}</td>
                <td style={{ padding: 8, border: "1px solid #333", maxWidth: 300, wordBreak: "break-word" }}>{ticket.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
} 