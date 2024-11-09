import serverless from 'serverless-http';
import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import type { Request, Response } from 'express';
import type { GameData, PlayerFact } from './types';

const app = express();

// CORS configuration
app.use(cors({
  origin: ['https://play9-frontend.netlify.app', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'DELETE'],
  credentials: true
}));
app.use(express.json());

// Database setup
const dbPath = process.env.SQLITE_DB_PATH || '/tmp/golf.db';
const db = new sqlite3.Database(dbPath);

// Promise wrappers for database operations
const run = (sql: string, params: any[] = []): Promise<any> => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
};

const get = (sql: string, params: any[] = []): Promise<any> => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

const all = (sql: string, params: any[] = []): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

// Initialize database tables
async function initDb() {
  await run(`
    CREATE TABLE IF NOT EXISTS games (
      id TEXT PRIMARY KEY,
      date TEXT NOT NULL,
      player_names TEXT NOT NULL,
      scores TEXT NOT NULL,
      final_totals TEXT NOT NULL
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS player_facts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      player_name TEXT UNIQUE NOT NULL,
      fact TEXT NOT NULL,
      created_at TEXT NOT NULL
    )
  `);
}

// Initialize database
initDb().catch(console.error);

// Game History endpoints
app.get('/api/games', async (_req: Request, res: Response) => {
  try {
    const games = await all('SELECT * FROM games ORDER BY date DESC');
    const formattedGames = games.map(row => ({
      id: row.id,
      date: row.date,
      playerNames: JSON.parse(row.player_names),
      scores: JSON.parse(row.scores),
      finalTotals: JSON.parse(row.final_totals)
    }));
    res.json(formattedGames);
  } catch (error) {
    console.error('Error fetching games:', error);
    res.status(500).json({ error: 'Failed to fetch games' });
  }
});

app.get('/api/games/:id', async (req: Request, res: Response) => {
  try {
    const row = await get('SELECT * FROM games WHERE id = ?', [req.params.id]);
    
    if (!row) {
      res.status(404).json({ error: 'Game not found' });
      return;
    }

    const game = {
      id: row.id,
      date: row.date,
      playerNames: JSON.parse(row.player_names),
      scores: JSON.parse(row.scores),
      finalTotals: JSON.parse(row.final_totals)
    };
    
    res.json(game);
  } catch (error) {
    console.error('Error fetching game:', error);
    res.status(500).json({ error: 'Failed to fetch game' });
  }
});

app.post('/api/games', async (req: Request, res: Response) => {
  try {
    const game = req.body as GameData;
    await run(
      'INSERT INTO games (id, date, player_names, scores, final_totals) VALUES (?, ?, ?, ?, ?)',
      [
        game.id,
        game.date,
        JSON.stringify(game.playerNames),
        JSON.stringify(game.scores),
        JSON.stringify(game.finalTotals)
      ]
    );
    res.status(201).json(game);
  } catch (error) {
    console.error('Error saving game:', error);
    res.status(500).json({ error: 'Failed to save game' });
  }
});

// Player Facts endpoints
app.get('/api/player-facts', async (_req: Request, res: Response) => {
  try {
    const facts = await all('SELECT id, player_name, fact, created_at FROM player_facts ORDER BY created_at DESC');
    const formattedFacts = facts.map(row => ({
      id: row.id,
      playerName: row.player_name,
      fact: row.fact,
      createdAt: new Date(row.created_at)
    }));
    res.json(formattedFacts);
  } catch (error) {
    console.error('Error fetching player facts:', error);
    res.status(500).json({ error: 'Failed to fetch player facts' });
  }
});

app.post('/api/player-facts', async (req: Request, res: Response) => {
  try {
    const { playerName, fact, createdAt } = req.body as PlayerFact;
    const result = await run(
      'INSERT INTO player_facts (player_name, fact, created_at) VALUES (?, ?, ?)',
      [playerName, fact, createdAt.toISOString()]
    );

    const savedFact = await get(
      'SELECT id, player_name, fact, created_at FROM player_facts WHERE id = last_insert_rowid()'
    );

    res.status(201).json({
      id: savedFact.id,
      playerName: savedFact.player_name,
      fact: savedFact.fact,
      createdAt: new Date(savedFact.created_at)
    });
  } catch (error) {
    console.error('Error saving player fact:', error);
    res.status(500).json({ error: 'Failed to save player fact' });
  }
});

app.delete('/api/player-facts/:playerName', async (req: Request, res: Response) => {
  try {
    await run('DELETE FROM player_facts WHERE player_name = ?', [req.params.playerName]);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting player fact:', error);
    res.status(500).json({ error: 'Failed to delete player fact' });
  }
});

// Export for Netlify Functions
export const handler = serverless(app);
