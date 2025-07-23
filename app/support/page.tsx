"use client";
import { useState } from 'react';
import styles from '../page.module.css';

export default function Support() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ nom: '', email: '', sujet: '', message: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/send-support-mail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (data.success) {
        setSent(true);
      } else {
        setError(data.error || "Erreur lors de l'envoi du message.");
      }
    } catch (err: any) {
      setError("Erreur lors de l'envoi du message.");
    }
    setLoading(false);
  };

  return (
    <main className={styles['catalogue-modern-bg']} style={{ minHeight: '80vh' }}>
      <div className={styles['home-section']} style={{ maxWidth: 500, marginTop: 40 }}>
        <h1 className={styles['catalogue-modern-title']} style={{ fontSize: '2rem', marginBottom: 18 }}>Support & Contact</h1>
        {sent ? (
          <div style={{ color: '#00c6ff', fontWeight: 700, fontSize: 20, textAlign: 'center', margin: '32px 0' }}>
            Merci pour votre message !<br />Nous vous répondrons rapidement.
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 18 }}>
              <label style={{ fontWeight: 600, color: '#fff' }} htmlFor="nom">Nom</label>
              <input
                type="text"
                id="nom"
                name="nom"
                value={form.nom}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #ccc', marginTop: 4 }}
                disabled={loading}
              />
            </div>
            <div style={{ marginBottom: 18 }}>
              <label style={{ fontWeight: 600, color: '#fff' }} htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #ccc', marginTop: 4 }}
                disabled={loading}
              />
            </div>
            <div style={{ marginBottom: 18 }}>
              <label style={{ fontWeight: 600, color: '#fff' }} htmlFor="sujet">Sujet</label>
              <input
                type="text"
                id="sujet"
                name="sujet"
                value={form.sujet}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #ccc', marginTop: 4 }}
                disabled={loading}
              />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ fontWeight: 600, color: '#fff' }} htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                rows={5}
                style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #ccc', marginTop: 4, resize: 'vertical' }}
                disabled={loading}
              />
            </div>
            {error && <div style={{ color: 'red', marginBottom: 12, textAlign: 'center' }}>{error}</div>}
            <button
              type="submit"
              className={styles['catalogue-modern-card-btn']}
              style={{ width: '100%', fontSize: 18 }}
              disabled={loading}
            >
              {loading ? 'Envoi en cours...' : 'Envoyer'}
            </button>
          </form>
        )}
      </div>
    </main>
  );
} 