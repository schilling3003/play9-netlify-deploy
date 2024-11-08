import { GameData, GameSummary, PlayerFact } from '../types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3002/api';

// Utility function to check server connectivity
async function checkServerConnectivity(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/games`);
    return response.ok;
  } catch {
    return false;
  }
}

// Game History API
export async function getGames(): Promise<GameData[]> {
  const response = await fetch(`${API_BASE}/games`);
  if (!response.ok) throw new Error('Failed to fetch games');
  return response.json();
}

export async function getGameById(id: string): Promise<GameData | undefined> {
  const response = await fetch(`${API_BASE}/games/${id}`);
  if (!response.ok) {
    if (response.status === 404) return undefined;
    throw new Error('Failed to fetch game');
  }
  return response.json();
}

export async function saveGame(game: Omit<GameData, 'id' | 'date'>): Promise<GameData> {
  const newGame: GameData = {
    ...game,
    id: Date.now().toString(),
    date: new Date().toISOString().split('T')[0]
  };

  const response = await fetch(`${API_BASE}/games`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newGame)
  });

  if (!response.ok) throw new Error('Failed to save game');
  return response.json();
}

export async function searchGames(playerNames: string[]): Promise<GameSummary[]> {
  const games = await getGames();
  return games
    .filter(game => 
      playerNames.length === 0 || 
      playerNames.every(name => 
        game.playerNames.some(playerName => 
          playerName.toLowerCase().includes(name.toLowerCase())
        )
      )
    )
    .map(game => {
      const minScore = Math.min(...game.finalTotals);
      const winnerIndex = game.finalTotals.indexOf(minScore);
      return {
        id: game.id,
        date: game.date,
        playerCount: game.playerNames.length,
        scores: game.scores.map(roundScores => roundScores[0]), // Get first player's scores as required by GameSummary
        finalTotals: game.finalTotals,
        winner: {
          name: game.playerNames[winnerIndex],
          score: minScore
        }
      };
    });
}

export async function getBestScores(): Promise<GameData[]> {
  const games = await getGames();
  return games
    .sort((a, b) => Math.min(...a.finalTotals) - Math.min(...b.finalTotals))
    .slice(0, 3);
}

// Player Facts API
export async function getPlayerFacts(): Promise<PlayerFact[]> {
  const response = await fetch(`${API_BASE}/player-facts`);
  if (!response.ok) throw new Error('Failed to fetch player facts');
  return response.json();
}

export async function savePlayerFact(fact: PlayerFact): Promise<PlayerFact> {
  const response = await fetch(`${API_BASE}/player-facts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(fact)
  });

  if (!response.ok) throw new Error('Failed to save player fact');
  return response.json();
}

export async function deletePlayerFact(playerName: string): Promise<void> {
  const response = await fetch(`${API_BASE}/player-facts/${encodeURIComponent(playerName)}`, {
    method: 'DELETE'
  });

  if (!response.ok) throw new Error('Failed to delete player fact');
}

export { checkServerConnectivity };
