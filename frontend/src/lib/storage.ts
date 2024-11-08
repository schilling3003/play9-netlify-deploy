import { GameData, GameSummary, PlayerFact } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

export const getGames = async (): Promise<GameData[]> => {
  const response = await fetch(`${API_BASE_URL}/api/games`);
  if (!response.ok) {
    throw new Error('Failed to fetch games');
  }
  return response.json();
};

export const getGameSummaries = async (): Promise<GameSummary[]> => {
  const games = await getGames();
  return games.map(game => {
    const winnerIndex = game.finalTotals.indexOf(Math.min(...game.finalTotals));
    return {
      id: game.id,
      date: game.date,
      playerCount: game.playerNames.length,
      scores: game.finalTotals,
      finalTotals: game.finalTotals,
      winner: {
        name: game.playerNames[winnerIndex],
        score: game.finalTotals[winnerIndex]
      }
    };
  });
};

export const getGameById = async (id: string): Promise<GameData | undefined> => {
  const response = await fetch(`${API_BASE_URL}/api/games/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch game');
  }
  return response.json();
};

export const saveGame = async (game: Omit<GameData, 'id' | 'date'>): Promise<GameData> => {
  const response = await fetch(`${API_BASE_URL}/api/games`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...game,
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0]
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to save game');
  }
  return response.json();
};

export const searchGames = async (playerNames: string[]): Promise<GameSummary[]> => {
  const games = await getGames();
  const filteredGames = playerNames.length === 0 ? games : games.filter(game => 
    playerNames.every(name => 
      game.playerNames.some(playerName => 
        playerName.toLowerCase().includes(name.toLowerCase())
      )
    )
  );

  return filteredGames.map(game => {
    const winnerIndex = game.finalTotals.indexOf(Math.min(...game.finalTotals));
    return {
      id: game.id,
      date: game.date,
      playerCount: game.playerNames.length,
      scores: game.finalTotals,
      finalTotals: game.finalTotals,
      winner: {
        name: game.playerNames[winnerIndex],
        score: game.finalTotals[winnerIndex]
      }
    };
  });
};

export const getBestScores = async (): Promise<GameData[]> => {
  const games = await getGames();
  return games
    .sort((a, b) => Math.min(...a.finalTotals) - Math.min(...b.finalTotals))
    .slice(0, 3);
};

export const getPlayerFacts = async (): Promise<PlayerFact[]> => {
  const response = await fetch(`${API_BASE_URL}/api/player-facts`);
  if (!response.ok) {
    throw new Error('Failed to fetch player facts');
  }
  return response.json();
};

export const savePlayerFact = async (fact: Omit<PlayerFact, 'id'>): Promise<PlayerFact> => {
  const response = await fetch(`${API_BASE_URL}/api/player-facts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(fact),
  });

  if (!response.ok) {
    throw new Error('Failed to save player fact');
  }
  return response.json();
};

export const deletePlayerFact = async (playerName: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/api/player-facts/${playerName}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete player fact');
  }
};
