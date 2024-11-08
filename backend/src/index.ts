import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import type { Request, Response } from 'express';
import { GameData, PlayerFact } from './types.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database setup
let db: any;

// Initialize database tables
async function initDb() {
  db = await open({
    filename: './golf.db',
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS games (
      id TEXT PRIMARY KEY,
      date TEXT NOT NULL,
      player_names TEXT NOT NULL,
      scores TEXT NOT NULL,
      final_totals TEXT NOT NULL
    )
  `);

  await db.exec(`
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
    const games = await db.all('SELECT * FROM games ORDER BY date DESC');
    const parsedGames = games.map((row: any) => ({
      id: row.id,
      date: row.date,
      playerNames: JSON.parse(row.player_names),
      scores: JSON.parse(row.scores),
      finalTotals: JSON.parse(row.final_totals)
    }));
    res.json(parsedGames);
  } catch (error) {
    console.error('Error fetching games:', error);
    res.status(500).json({ error: 'Failed to fetch games' });
  }
});

app.get('/api/games/:id', async (req: Request, res: Response) => {
  try {
    const game = await db.get('SELECT * FROM games WHERE id = ?', [req.params.id]);
    
    if (!game) {
      res.status(404).json({ error: 'Game not found' });
      return;
    }

    const parsedGame = {
      id: game.id,
      date: game.date,
      playerNames: JSON.parse(game.player_names),
      scores: JSON.parse(game.scores),
      finalTotals: JSON.parse(game.final_totals)
    };
    
    res.json(parsedGame);
  } catch (error) {
    console.error('Error fetching game:', error);
    res.status(500).json({ error: 'Failed to fetch game' });
  }
});

app.post('/api/games', async (req: Request, res: Response) => {
  try {
    const game = req.body as GameData;
    await db.run(
      `INSERT INTO games (id, date, player_names, scores, final_totals)
       VALUES (?, ?, ?, ?, ?)`,
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
    const facts = await db.all('SELECT id, player_name, fact, created_at FROM player_facts ORDER BY created_at DESC');
    const parsedFacts = facts.map((row: any) => ({
      id: row.id,
      playerName: row.player_name,
      fact: row.fact,
      createdAt: new Date(row.created_at)
    }));
    res.json(parsedFacts);
  } catch (error) {
    console.error('Error fetching player facts:', error);
    res.status(500).json({ error: 'Failed to fetch player facts' });
  }
});

app.post('/api/player-facts', async (req: Request, res: Response) => {
  try {
    const { playerName, fact, createdAt } = req.body as PlayerFact;
    const result = await db.run(
      `INSERT INTO player_facts (player_name, fact, created_at)
       VALUES (?, ?, ?)`,
      [
        playerName,
        fact,
        createdAt.toISOString()
      ]
    );

    const savedFact: PlayerFact = {
      id: result.lastID,
      playerName,
      fact,
      createdAt
    };

    res.status(201).json(savedFact);
  } catch (error) {
    console.error('Error saving player fact:', error);
    res.status(500).json({ error: 'Failed to save player fact' });
  }
});

app.delete('/api/player-facts/:playerName', async (req: Request, res: Response) => {
  try {
    await db.run('DELETE FROM player_facts WHERE player_name = ?', [req.params.playerName]);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting player fact:', error);
    res.status(500).json({ error: 'Failed to delete player fact' });
  }
});

// Start server
const port = 3001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
