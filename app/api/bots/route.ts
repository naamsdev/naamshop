import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// Corriger le chemin pour qu'il pointe directement vers le dossier data
const dataFilePath = path.join(process.cwd(), 'data', 'bots.json');

interface Bot {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

async function readBotsData(): Promise<Bot[]> {
  try {
    const fileContent = await fs.readFile(dataFilePath, 'utf8');
    return JSON.parse(fileContent);
  } catch {
    console.error('Erreur lors de la lecture du fichier bots.json');
    // En cas d'erreur (ex: fichier non trouvé), retourner un tableau vide
    return [];
  }
}

export async function GET() {
  try {
    const bots = await readBotsData();
    // Toujours retourner les bots, même si le tableau est vide.
    // Le front-end gérera l'affichage d'un catalogue vide.
    return NextResponse.json(bots);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
} 