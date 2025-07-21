import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

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
    // Si le fichier n'existe pas, retourner les données par défaut
    return [
      {
        id: "1",
        name: "Bot Modération",
        description: "Bot de modération avancé avec système de logs, auto-modération et gestion des rôles",
        price: 29.99,
        image: "https://via.placeholder.com/300x200/0072ff/ffffff?text=Bot+Moderation"
      },
      {
        id: "2", 
        name: "Bot Musique",
        description: "Bot de musique avec support YouTube, Spotify, gestion des playlists et contrôles avancés",
        price: 24.99,
        image: "https://via.placeholder.com/300x200/28a745/ffffff?text=Bot+Musique"
      },
      {
        id: "3",
        name: "Bot Économie",
        description: "Système d'économie complet avec boutique, inventaire, jobs et mini-jeux",
        price: 19.99,
        image: "https://via.placeholder.com/300x200/ffc107/ffffff?text=Bot+Economie"
      },
      {
        id: "4",
        name: "Bot Ticket",
        description: "Système de tickets de support avec gestion des priorités et intégration staff",
        price: 34.99,
        image: "https://via.placeholder.com/300x200/dc3545/ffffff?text=Bot+Ticket"
      }
    ];
  }
}

// Fonction pour écrire les données
async function writeBotsData(data: Bot[]) {
  try {
    // Créer le dossier data s'il n'existe pas
    const dataDir = path.dirname(dataFilePath);
    await fs.mkdir(dataDir, { recursive: true });
    
    await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Erreur écriture données:', error);
  }
}

// GET - Récupérer tous les bots
export async function GET() {
  try {
    const bots = await readBotsData();
    return NextResponse.json(bots);
  } catch {
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des bots' },
      { status: 500 }
    );
  }
}

// POST - Ajouter un nouveau bot
export async function POST(request: NextRequest) {
  try {
    const newBot = await request.json();
    
    // Validation
    if (!newBot.name || !newBot.description || !newBot.price) {
      return NextResponse.json(
        { error: 'Données manquantes' },
        { status: 400 }
      );
    }

    const bots = await readBotsData();
    
    // Générer un ID unique
    const newId = (Math.max(...bots.map((b: Bot) => parseInt(b.id))) + 1).toString();
    
    const botToAdd = {
      id: newId,
      name: newBot.name,
      description: newBot.description,
      price: parseFloat(newBot.price),
      image: newBot.image || `https://via.placeholder.com/300x200/0072ff/ffffff?text=${encodeURIComponent(newBot.name)}`
    };

    bots.push(botToAdd);
    await writeBotsData(bots);

    return NextResponse.json(botToAdd, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: 'Erreur lors de l\'ajout du bot' },
      { status: 500 }
    );
  }
}

// PUT - Modifier un bot existant
export async function PUT(request: NextRequest) {
  try {
    const updatedBot = await request.json();
    
    if (!updatedBot.id) {
      return NextResponse.json(
        { error: 'ID manquant' },
        { status: 400 }
      );
    }

    const bots = await readBotsData();
    const botIndex = bots.findIndex((b: Bot) => b.id === updatedBot.id);
    
    if (botIndex === -1) {
      return NextResponse.json(
        { error: 'Bot non trouvé' },
        { status: 404 }
      );
    }

    bots[botIndex] = {
      ...bots[botIndex],
      name: updatedBot.name,
      description: updatedBot.description,
      price: parseFloat(updatedBot.price),
      image: updatedBot.image
    };

    await writeBotsData(bots);
    return NextResponse.json(bots[botIndex]);
  } catch {
    return NextResponse.json(
      { error: 'Erreur lors de la modification du bot' },
      { status: 500 }
    );
  }
} 