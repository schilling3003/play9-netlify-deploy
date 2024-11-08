import React, { useState, useEffect } from 'react';
import { getGameSummaries, searchGames } from '../lib/storage';
import { GameSummary } from '../types';

export const GameHistory: React.FC = () => {
  const [games, setGames] = useState<GameSummary[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        setIsLoading(true);
        const fetchedGames = searchQuery 
          ? await searchGames(searchQuery.split(',').map(q => q.trim()))
          : await getGameSummaries();
        setGames(fetchedGames);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchGames();
  }, [searchQuery]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  if (isLoading) {
    return <div className="text-center text-text-secondary py-8">Loading game history...</div>;
  }

  if (error) {
    return <div className="text-center text-error py-8">{error}</div>;
  }

  return (
    <div className="bg-surface rounded-xl shadow-glow p-4 sm:p-6">
      <div className="mb-4">
        <input 
          type="text" 
          placeholder="Search by player name (comma-separated)" 
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full px-3 py-2 border border-surface-light rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      {games.length === 0 ? (
        <div className="text-center text-text-secondary py-8">
          No games found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-surface-light">
                <th className="px-3 py-2 text-left text-text font-medium">Date</th>
                <th className="px-3 py-2 text-left text-text font-medium">Players</th>
                <th className="px-3 py-2 text-left text-text font-medium">Winner</th>
                <th className="px-3 py-2 text-left text-text font-medium">Score</th>
              </tr>
            </thead>
            <tbody className="text-text">
              {games.slice(0, 10).map((game) => (
                <tr key={game.id} className="border-b border-surface-light">
                  <td className="px-3 py-2">{game.date}</td>
                  <td className="px-3 py-2">{game.playerCount} players</td>
                  <td className="px-3 py-2">{game.winner.name}</td>
                  <td className="px-3 py-2">{game.winner.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default GameHistory;
