import React, { useState } from 'react';
import { Trophy, Search, History, ArrowLeft } from 'lucide-react';
import { getGameSummaries, getBestScores, searchGames, type GameSummary } from '../lib/storage';
import { GameDetails } from './GameDetails';

const bgColors = [
  'bg-yellow-500',
  'bg-gray-400',
  'bg-amber-700'
];

const iconClasses = [
  'text-yellow-500',
  'text-gray-400',
  'text-amber-700'
];

export const GameHistory: React.FC = () => {
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const bestScores = getBestScores();
  const gameSummaries = searchQuery.trim() 
    ? searchGames(searchQuery.split(',').map(s => s.trim()).filter(Boolean))
    : getGameSummaries();

  if (selectedGameId) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => setSelectedGameId(null)}
          className="flex items-center gap-2 text-text hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to History
        </button>
        <GameDetails gameId={selectedGameId} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-2">
        {bestScores.slice(0, 3).map((game, index) => {
          const lowestScore = Math.min(...game.finalTotals);
          const winnerIndex = game.finalTotals.indexOf(lowestScore);
          const winnerName = game.playerNames[winnerIndex];
          
          return (
            <div
              key={game.id}
              className={`flex items-center gap-2 p-2 sm:p-3 rounded-lg bg-surface bg-opacity-50 border border-opacity-20 ${
                index === 0 ? 'border-yellow-500' : index === 1 ? 'border-gray-400' : 'border-amber-700'
              }`}
            >
              <div className={`p-1.5 sm:p-2 rounded-full ${bgColors[index]} bg-opacity-20 shrink-0`}>
                <Trophy className={`h-4 w-4 sm:h-5 sm:w-5 ${iconClasses[index]}`} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium text-text truncate">{winnerName}</div>
                <div className="text-xs text-text-secondary">{lowestScore} points</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by player names (comma-separated)"
          className="w-full bg-surface border-none rounded-lg py-2 pl-10 pr-4 text-text placeholder-text-secondary focus:ring-2 focus:ring-primary"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-secondary" />
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-text">
          <History className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Game History</h2>
        </div>

        <div className="space-y-2">
          {gameSummaries.map((game) => (
            <button
              key={game.id}
              onClick={() => setSelectedGameId(game.id)}
              className="w-full p-3 bg-surface hover:bg-surface-light rounded-lg transition-colors text-left"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-text-secondary">{game.date}</span>
                <span className="text-sm text-text-secondary">{game.playerCount} Players</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-primary" />
                  <span className="text-text">{game.winner.name}</span>
                </div>
                <span className="font-medium text-primary">{game.winner.score} points</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};