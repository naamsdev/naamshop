import type { Metadata } from "next";
import { Inter } from "next/font/google";
import NavBarClientOnly from "./components/NavBarClientOnly";
import PageTransition from "./components/PageTransition";
import ViewCounter from "./components/ViewCounter";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Vente de Bots Discord",
  description: "Achetez des bots Discord professionnels pour votre serveur !",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body style={{
        margin: 0,
        padding: 0,
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
        fontFamily: inter.style.fontFamily,
        color: '#fff',
        overflowX: 'hidden'
      }}>
        <NavBarClientOnly />
        <ViewCounter />
        <PageTransition>
        {children}
        </PageTransition>
        <footer style={{
          background: 'rgba(0, 0, 0, 0.3)',
          color: '#fff',
          textAlign: 'center',
          padding: '20px',
          marginTop: 'auto',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)'
        }}>
          Site web et bot discord 100% conçus par Naams
        </footer>
      </body>
    </html>
  );
}
