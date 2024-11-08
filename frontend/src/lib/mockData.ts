import { GameHistory } from '../types';

const generateScore = (): number => {
  // 70% chance of normal score (-5 to 20)
  // 20% chance of very good score (-20 to -6)
  // 10% chance of very bad score (21 to 60)
  const rand = Math.random();
  if (rand < 0.7) {
    return Math.floor(Math.random() * 26) - 5; // -5 to 20
  } else if (rand < 0.9) {
    return Math.floor(Math.random() * 15) - 20; // -20 to -6
  } else {
    return Math.floor(Math.random() * 40) + 21; // 21 to 60
  }
};

const mockPlayers = [
  ['Brandon', 'Tanner', 'Danni'],
  ['Mike', 'Sarah', 'John', 'Lisa'],
  ['Alex', 'Emma', 'Chris'],
  ['Brandon', 'Mike', 'Sarah'],
  ['Tanner', 'Danni', 'John', 'Lisa'],
];

export const generateMockGames = (): GameHistory[] => {
  const now = new Date();
  
  return mockPlayers.map((players, gameIndex) => {
    // Games spread over the last 7 days
    const gameDate = new Date(now);
    gameDate.setDate(gameDate.getDate() - (7 - gameIndex));
    gameDate.setHours(Math.floor(Math.random() * 12) + 9); // Between 9 AM and 8 PM
    gameDate.setMinutes(Math.floor(Math.random() * 60));

    const scores = Array(9).fill(null).map(() => 
      Array(players.length).fill(null).map(() => generateScore())
    );

    return {
      id: crypto.randomUUID(),
      date: gameDate.toISOString(),
      playerCount: players.length,
      playerNames: players,
      scores,
      finalTotals: scores.reduce((totals, roundScores) => 
        totals.map((total, i) => total + roundScores[i]), 
        new Array(players.length).fill(0)
      )
    };
  });
};