import serverless from 'serverless-http';
import express from 'express';
import cors from 'cors';
import { createClient } from '@libsql/client';
import type { Request, Response } from 'express';
import type { GameData, PlayerFact } from './types';

const app = express();

// CORS configuration
const corsOptions = {
  origin: true, // This allows all origins in production
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Database setup
if (!process.env.TURSO_DATABASE_URL || !process.env.TURSO_AUTH_TOKEN) {
  throw new Error('Missing required environment variables: TURSO_DATABASE_URL and TURSO_AUTH_TOKEN must be set');
}

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN
});

// Initialize database tables
async function initDb() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS games (
      id TEXT PRIMARY KEY,
      date TEXT NOT NULL,
      player_names TEXT NOT NULL,
      scores TEXT NOT NULL,
      final_totals TEXT NOT NULL
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS player_facts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      player_name TEXT UNIQUE NOT NULL,
      fact TEXT NOT NULL,
      created_at TEXT NOT NULL
    )
  `);
}

// Game History endpoints
app.get('/api/games', async (_req: Request, res: Response) => {
  try {
    await initDb();
    const result = await db.execute('SELECT * FROM games ORDER BY date DESC');
    const games = result.rows.map((row: any) => ({
      id: row.id,
      date: row.date,
      playerNames: JSON.parse(row.player_names as string),
      scores: JSON.parse(row.scores as string),
      finalTotals: JSON.parse(row.final_totals as string)
    }));
    res.json(games);
  } catch (error) {
    console.error('Error fetching games:', error);
    res.status(500).json({ error: 'Failed to fetch games' });
  }
});

app.get('/api/games/:id', async (req: Request, res: Response) => {
  try {
    await initDb();
    const result = await db.execute({
      sql: 'SELECT * FROM games WHERE id = ?',
      args: [req.params.id]
    });
    
    if (!result.rows.length) {
      res.status(404).json({ error: 'Game not found' });
      return;
    }

    const row = result.rows[0];
    const game = {
      id: row.id,
      date: row.date,
      playerNames: JSON.parse(row.player_names as string),
      scores: JSON.parse(row.scores as string),
      finalTotals: JSON.parse(row.final_totals as string)
    };
    
    res.json(game);
  } catch (error) {
    console.error('Error fetching game:', error);
    res.status(500).json({ error: 'Failed to fetch game' });
  }
});

app.post('/api/games', async (req: Request, res: Response) => {
  try {
    await initDb();
    const game = req.body as GameData;
    await db.execute({
      sql: `INSERT INTO games (id, date, player_names, scores, final_totals)
            VALUES (?, ?, ?, ?, ?)`,
      args: [
        game.id,
        game.date,
        JSON.stringify(game.playerNames),
        JSON.stringify(game.scores),
        JSON.stringify(game.finalTotals)
      ]
    });
    res.status(201).json(game);
  } catch (error) {
    console.error('Error saving game:', error);
    res.status(500).json({ error: 'Failed to save game' });
  }
});

// Player Facts endpoints
app.get('/api/player-facts', async (_req: Request, res: Response) => {
  try {
    await initDb();
    const result = await db.execute('SELECT id, player_name, fact, created_at FROM player_facts ORDER BY created_at DESC');
    const facts = result.rows.map((row: any) => ({
      id: row.id as number,
      playerName: row.player_name as string,
      fact: row.fact as string,
      createdAt: new Date(row.created_at as string)
    }));
    res.json(facts);
  } catch (error) {
    console.error('Error fetching player facts:', error);
    res.status(500).json({ error: 'Failed to fetch player facts' });
  }
});

app.post('/api/player-facts', async (req: Request, res: Response) => {
  try {
    await initDb();
    const { playerName, fact, createdAt } = req.body as PlayerFact;
    const result = await db.execute({
      sql: `INSERT INTO player_facts (player_name, fact, created_at)
            VALUES (?, ?, ?)
            RETURNING id, player_name, fact, created_at`,
      args: [
        playerName,
        fact,
        createdAt.toISOString()
      ]
    });

    const row = result.rows[0];
    const savedFact: PlayerFact = {
      id: row.id as number,
      playerName: row.player_name as string,
      fact: row.fact as string,
      createdAt: new Date(row.created_at as string)
    };

    res.status(201).json(savedFact);
  } catch (error) {
    console.error('Error saving player fact:', error);
    res.status(500).json({ error: 'Failed to save player fact' });
  }
});

app.delete('/api/player-facts/:playerName', async (req: Request, res: Response) => {
  try {
    await initDb();
    await db.execute({
      sql: 'DELETE FROM player_facts WHERE player_name = ?',
      args: [req.params.playerName]
    });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting player fact:', error);
    res.status(500).json({ error: 'Failed to delete player fact' });
  }
});

// Export for Netlify Functions
export const handler = serverless(app);
