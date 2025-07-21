import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

/* eslint-disable @typescript-eslint/no-explicit-any */

const dataFilePath = path.join(process.cwd(), 'data', 'bots.json');

// Ajoute l'interface Bot
interface Bot {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

// Fonction pour lire les données
async function readBotsData() {
  try {
    const data = await fs.readFile(dataFilePath, 'utf8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// Fonction pour écrire les données
async function writeBotsData(data: Bot[]) {
  try {
    const dataDir = path.dirname(dataFilePath);
    await fs.mkdir(dataDir, { recursive: true });
    await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));
  } catch {
    // Erreur lors de l'écriture des données
  }
}

export async function DELETE(
  request: NextRequest,
  context: any
) {
  try {
    const { id } = context.params as { id: string };
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID manquant' },
        { status: 400 }
      );
    }

    const bots = await readBotsData();
    const botIndex = bots.findIndex((b: Bot) => b.id === id);
    
    if (botIndex === -1) {
      return NextResponse.json(
        { error: 'Bot non trouvé' },
        { status: 404 }
      );
    }

    // Supprimer le bot
    const deletedBot = bots.splice(botIndex, 1)[0];
    await writeBotsData(bots);

    return NextResponse.json({ 
      message: 'Bot supprimé avec succès',
      deletedBot 
    });
  } catch {
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du bot' },
      { status: 500 }
    );
  }
} 