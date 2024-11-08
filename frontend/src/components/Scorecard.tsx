import React from 'react';
import { Trophy } from 'lucide-react';

interface ScorecardProps {
  players: string[];
  scores: number[][];
  currentRound: number;
}

export const Scorecard: React.FC<ScorecardProps> = ({ players, scores, currentRound }) => {
  const calculateSubtotal = (playerIndex: number, upToRound: number) => {
    return scores
      .slice(0, upToRound)
      .reduce((total, roundScores) => {
        const score = roundScores[playerIndex];
        return total + (score || 0);
      }, 0);
  };

  const calculateTotal = (playerIndex: number) => {
    return scores.reduce((total, roundScores) => {
      const score = roundScores[playerIndex];
      return total + (score || 0);
    }, 0);
  };

  const isRoundComplete = (roundIndex: number) => {
    return scores[roundIndex].every(score => score !== 0);
  };

  const getLeaderboard = () => {
    return players
      .map((name, index) => ({
        name,
        total: calculateTotal(index),
      }))
      .sort((a, b) => a.total - b.total); // Sort by ascending score (lowest wins)
  };

  return (
    <div className="bg-surface rounded-xl shadow-glow p-4 sm:p-6">
      <h2 className="text-2xl font-bold text-text mb-6 flex items-center gap-3">
        <Trophy className="h-7 w-7 text-yellow-500" />
        Scorecard
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-surface-light">
              <th className="px-2 sm:px-4 py-3 text-left text-text font-medium">#</th>
              {players.map((player, index) => (
                <th key={index} className="px-2 sm:px-4 py-3 text-left text-text font-medium">
                  {player}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-text">
            {scores.map((roundScores, roundIndex) => (
              <React.Fragment key={roundIndex}>
                <tr className={`
                  border-b border-surface-light
                  ${roundIndex === currentRound - 1 ? 'bg-primary bg-opacity-10' : ''}
                `}>
                  <td className="px-2 sm:px-4 py-3 font-medium">{roundIndex + 1}</td>
                  {roundScores.map((score, playerIndex) => (
                    <td key={playerIndex} className="px-2 sm:px-4 py-3 font-medium">
                      {score === 0 ? '' : score}
                    </td>
                  ))}
                </tr>
                {roundIndex > 0 && roundIndex < 8 && isRoundComplete(roundIndex) && (
                  <tr className="bg-surface-light bg-opacity-30 border-b border-surface-light">
                    <td className="px-2 sm:px-4 py-2 font-medium text-text-secondary">Subtotal</td>
                    {players.map((_, playerIndex) => (
                      <td key={playerIndex} className="px-2 sm:px-4 py-2 font-medium text-primary">
                        {calculateSubtotal(playerIndex, roundIndex + 1)}
                      </td>
                    ))}
                  </tr>
                )}
              </React.Fragment>
            ))}
            <tr className="font-bold border-t-2 border-primary bg-surface-light bg-opacity-20">
              <td className="px-2 sm:px-4 py-3 text-text">Total</td>
              {players.map((_, index) => (
                <td key={index} className="px-2 sm:px-4 py-3 text-primary">
                  {calculateTotal(index)}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-bold text-text flex items-center gap-2 mb-4">
          <Trophy className="h-6 w-6 text-yellow-500" />
          Leaderboard
        </h3>
        <div className="grid gap-3">
          {getLeaderboard().map((player, index) => (
            <div
              key={index}
              className={`
                flex items-center justify-between p-4 rounded-lg
                ${index === 0 
                  ? 'bg-primary bg-opacity-20 border border-primary border-opacity-30' 
                  : 'bg-surface-light bg-opacity-30'
                }
              `}
            >
              <span className="font-bold text-text">{player.name}</span>
              <span className={`font-bold ${index === 0 ? 'text-primary' : 'text-text-secondary'}`}>
                {player.total} points
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Scorecard;