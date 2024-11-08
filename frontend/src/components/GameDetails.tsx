import React, { useState, useEffect } from 'react';
import { getGameById } from '../lib/storage';
import { GameData } from '../types';

interface GameDetailsProps {
  gameId: string;
}

export const GameDetails: React.FC<GameDetailsProps> = ({ gameId }) => {
  const [game, setGame] = useState<GameData | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGame = async () => {
      try {
        setIsLoading(true);
        const fetchedGame = await getGameById(gameId);
        setGame(fetchedGame);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchGame();
  }, [gameId]);

  if (isLoading) {
    return (
      <div className="text-center text-text-secondary py-8">
        Loading game details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-error py-8">
        {error}
      </div>
    );
  }

  if (!game) {
    return (
      <div className="text-center text-text-secondary py-8">
        Game not found.
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-xl shadow-glow p-4 sm:p-6">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-surface-light">
              <th className="px-3 py-2 text-left text-text font-medium">#</th>
              {game.playerNames.map((name, index) => (
                <th key={index} className="px-3 py-2 text-left text-text font-medium">
                  {name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-text">
            {game.scores.map((roundScores, roundIndex) => (
              <tr key={roundIndex} className="border-b border-surface-light">
                <td className="px-3 py-2 font-medium">{roundIndex + 1}</td>
                {roundScores.map((score, playerIndex) => (
                  <td key={playerIndex} className="px-3 py-2">
                    {score}
                  </td>
                ))}
              </tr>
            ))}
            <tr className="font-bold border-t-2 border-primary">
              <td className="px-3 py-2 text-text">Total</td>
              {game.finalTotals.map((total, index) => (
                <td key={index} className="px-3 py-2 text-primary">
                  {total}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GameDetails;
