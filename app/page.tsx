"use client";
import { useRouter } from "next/navigation";
import styles from './page.module.css';

export default function Home() {
  const router = useRouter();
  return (
    <main className={styles['catalogue-modern-bg']}>
      <h1 className={styles['catalogue-modern-title']}>
        Bienvenue sur <span className={styles['home-title-gradient']}>NaamsShop</span>
      </h1>
      <h2 className={styles['home-subtitle']}>
        Votre boutique multi-services numériques
      </h2>
      <p className={styles['home-desc']}>
        NaamsShop vous propose plusieurs services numériques pour booster vos projets et votre présence en ligne. Découvrez nos offres adaptées à tous les besoins, que vous soyez particulier, créateur, ou entreprise.
      </p>

      {/* Section Bots Discord */}
      <section className={styles['home-section']}>
        <h3 className={styles['home-section-title']}>🤖 Bots Discord pré-développés & personnalisables</h3>
        <p className={styles['home-section-desc']}>
          Des bots performants, stables et adaptés à votre serveur : modération, tickets, économie, jeux, et bien plus. Prise en charge de la personnalisation selon vos besoins !
        </p>
        <ul className={styles['home-section-list']}>
          <li>🛡️ Modération & sécurité</li>
          <li>🎟️ Systèmes de tickets</li>
          <li>💰 Économie fictive, niveaux, jeux</li>
          <li>🎲 Commandes fun & animation</li>
        </ul>
      </section>

      {/* Section Montage */}
      <section className={styles['home-section']}>
        <h3 className={styles['home-section-title']}>🎬 Services de montage vidéo & audio</h3>
        <p className={styles['home-section-desc']}>
          Besoin d’un montage professionnel pour vos vidéos YouTube, TikTok, ou vos podcasts ? Je propose des montages dynamiques, adaptés à votre style et à votre audience.
        </p>
        <ul className={styles['home-section-list']}>
          <li>✂️ Découpage, transitions, effets</li>
          <li>🔊 Nettoyage audio, synchronisation</li>
          <li>🎨 Habillage graphique, sous-titres</li>
        </ul>
      </section>

      {/* Section Dev Web/FiveM */}
      <section className={styles['home-section']}>
        <h3 className={styles['home-section-title']}>💻 Développement Web & FiveM</h3>
        <p className={styles['home-section-desc']}>
          Création de sites web modernes, landing pages, outils personnalisés, ou scripts pour serveurs FiveM (GTA V). Solutions sur-mesure pour particuliers et professionnels.
        </p>
        <ul className={styles['home-section-list']}>
          <li>🌐 Sites vitrines, portfolios, landing pages</li>
          <li>🛠️ Développement d’outils personnalisés</li>
          <li>🚓 Création de script pour serveurs FiveM</li>
          <li>⚙️ Configuration de script pour serveurs FiveM</li>
        </ul>
      </section>

      <section className={styles['home-section']}>
        <h3 className={styles['home-section-title']}>🚀 Pourquoi choisir NaamsShop ?</h3>
        <ul className={styles['home-section-list']}>
          <li>✅ Un service personnalisé et à l’écoute</li>
          <li>🔒 Paiement sécurisé</li>
          <li>⏱️ Livraison rapide & respect des délais</li>
          <li>💬 Support réactif avant et après vente</li>
        </ul>
      </section>
      <button
        className={styles['home-btn']}
        onClick={() => router.push('/catalogue')}
      >
        Découvrir le catalogue
      </button>
    </main>
  );
}
