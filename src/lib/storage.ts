interface GameData {
  id: string;
  date: string;
  playerNames: string[];
  scores: number[][];
  finalTotals: number[];
}

interface GameSummary {
  id: string;
  date: string;
  playerCount: number;
  scores: number[];
  winner: {
    name: string;
    score: number;
  };
}

// Initialize games in localStorage if not present
const initializeStorage = () => {
  if (!localStorage.getItem('games')) {
    const mockGames: GameData[] = [
      {
        id: '1',
        date: '2024-03-15',
        playerNames: ['John', 'Sarah', 'Mike'],
        scores: [
          [-5, 12, 8],
          [15, -3, 4],
          [7, 10, -2],
          [3, 5, 12],
          [-8, 15, 6],
          [10, -4, 9],
          [4, 8, -5],
          [12, 3, 7],
          [-6, 11, 5]
        ],
        finalTotals: [32, 57, 44]
      },
      {
        id: '2',
        date: '2024-03-14',
        playerNames: ['Emma', 'David'],
        scores: [
          [8, -4],
          [-2, 12],
          [15, 6],
          [3, -8],
          [10, 5],
          [-5, 13],
          [7, -3],
          [4, 9],
          [12, -6]
        ],
        finalTotals: [52, 24]
      },
      {
        id: '3',
        date: '2024-03-13',
        playerNames: ['Alex', 'Lisa', 'Tom', 'Kate'],
        scores: [
          [-3, 8, 12, 5],
          [10, -5, 4, 15],
          [6, 13, -2, 7],
          [-8, 4, 9, 3],
          [15, -6, 5, 12],
          [3, 10, -4, 8],
          [7, 5, 13, -2],
          [-5, 12, 6, 9],
          [11, -3, 8, 4]
        ],
        finalTotals: [36, 38, 51, 61]
      }
    ];
    localStorage.setItem('games', JSON.stringify(mockGames));
  }
};

// Initialize storage on module load
initializeStorage();

export const getGames = (): GameData[] => {
  const gamesJson = localStorage.getItem('games');
  return gamesJson ? JSON.parse(gamesJson) : [];
};

export const getGameSummaries = (): GameSummary[] => {
  const games = getGames();
  return games.map(game => {
    const winnerIndex = game.finalTotals.indexOf(Math.min(...game.finalTotals));
    return {
      id: game.id,
      date: game.date,
      playerCount: game.playerNames.length,
      scores: game.finalTotals,
      winner: {
        name: game.playerNames[winnerIndex],
        score: game.finalTotals[winnerIndex]
      }
    };
  });
};

export const getGameById = (id: string): GameData | undefined => {
  const games = getGames();
  return games.find(game => game.id === id);
};

export const saveGame = (game: Omit<GameData, 'id' | 'date'>) => {
  const games = getGames();
  const newGame: GameData = {
    ...game,
    id: Date.now().toString(),
    date: new Date().toISOString().split('T')[0]
  };
  games.push(newGame);
  localStorage.setItem('games', JSON.stringify(games));
  return newGame;
};

export const searchGames = (playerNames: string[]): GameSummary[] => {
  const games = getGames();
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
      winner: {
        name: game.playerNames[winnerIndex],
        score: game.finalTotals[winnerIndex]
      }
    };
  });
};

export const getBestScores = (): GameData[] => {
  const games = getGames();
  return games
    .sort((a, b) => Math.min(...a.finalTotals) - Math.min(...b.finalTotals))
    .slice(0, 3);
};

export type { GameData, GameSummary };