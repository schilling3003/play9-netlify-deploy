const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

console.log('Starting server initialization...');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// File paths
const gamesFile = path.join(__dirname, 'games.json');
const factsFile = path.join(__dirname, 'player-facts.json');

console.log('Games file path:', gamesFile);
console.log('Facts file path:', factsFile);

// Initialize files if they don't exist
function initFiles() {
  console.log('Initializing files...');
  if (!fs.existsSync(gamesFile)) {
    console.log('Creating games.json');
    fs.writeFileSync(gamesFile, '[]');
  }
  if (!fs.existsSync(factsFile)) {
    console.log('Creating player-facts.json');
    fs.writeFileSync(factsFile, '[]');
  }
  console.log('Files initialized successfully');
}

// Initialize files
try {
  initFiles();
} catch (error) {
  console.error('Error initializing files:', error);
}

// Game History endpoints
app.get('/api/games', (_req, res) => {
  try {
    console.log('Fetching games...');
    const games = JSON.parse(fs.readFileSync(gamesFile, 'utf8'));
    res.json(games);
  } catch (error) {
    console.error('Error fetching games:', error);
    res.status(500).json({ error: 'Failed to fetch games' });
  }
});

app.get('/api/games/:id', (req, res) => {
  try {
    console.log('Fetching game:', req.params.id);
    const games = JSON.parse(fs.readFileSync(gamesFile, 'utf8'));
    const game = games.find(g => g.id === req.params.id);
    
    if (!game) {
      res.status(404).json({ error: 'Game not found' });
      return;
    }
    
    res.json(game);
  } catch (error) {
    console.error('Error fetching game:', error);
    res.status(500).json({ error: 'Failed to fetch game' });
  }
});

app.post('/api/games', (req, res) => {
  try {
    console.log('Saving new game:', req.body);
    const games = JSON.parse(fs.readFileSync(gamesFile, 'utf8'));
    const game = req.body;
    games.push(game);
    fs.writeFileSync(gamesFile, JSON.stringify(games, null, 2));
    res.status(201).json(game);
  } catch (error) {
    console.error('Error saving game:', error);
    res.status(500).json({ error: 'Failed to save game' });
  }
});

// Player Facts endpoints
app.get('/api/player-facts', (_req, res) => {
  try {
    console.log('Fetching player facts...');
    const facts = JSON.parse(fs.readFileSync(factsFile, 'utf8'));
    res.json(facts.map(fact => ({
      ...fact,
      createdAt: new Date(fact.createdAt)
    })));
  } catch (error) {
    console.error('Error fetching player facts:', error);
    res.status(500).json({ error: 'Failed to fetch player facts' });
  }
});

app.post('/api/player-facts', (req, res) => {
  try {
    console.log('Saving new player fact:', req.body);
    const facts = JSON.parse(fs.readFileSync(factsFile, 'utf8'));
    const fact = {
      ...req.body,
      id: Date.now()
    };
    facts.push(fact);
    fs.writeFileSync(factsFile, JSON.stringify(facts, null, 2));
    res.status(201).json({
      ...fact,
      createdAt: new Date(fact.createdAt)
    });
  } catch (error) {
    console.error('Error saving player fact:', error);
    res.status(500).json({ error: 'Failed to save player fact' });
  }
});

app.delete('/api/player-facts/:playerName', (req, res) => {
  try {
    console.log('Deleting player fact for:', req.params.playerName);
    const facts = JSON.parse(fs.readFileSync(factsFile, 'utf8'));
    const filteredFacts = facts.filter(f => f.playerName !== req.params.playerName);
    fs.writeFileSync(factsFile, JSON.stringify(filteredFacts, null, 2));
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting player fact:', error);
    res.status(500).json({ error: 'Failed to delete player fact' });
  }
});

// Start server
const port = 3002; // Changed port to 3002
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
