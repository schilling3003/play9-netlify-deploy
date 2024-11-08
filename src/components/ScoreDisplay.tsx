import React from 'react';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

interface ScoreDisplayProps {
  transcript: string;
  extractedScores: {
    round?: number;
    scores: Array<{ playerIndex: number; score: number }>;
  };
  error: string | null;
  processing: boolean;
  players: string[];
  currentRound: number;
}

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ 
  transcript, 
  extractedScores, 
  error,
  processing,
  players,
  currentRound
}) => {
  if (!transcript && extractedScores.scores.length === 0 && !error && !processing) return null;

  return (
    <div className="mt-4 space-y-2">
      {transcript && (
        <div className="p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            Transcript: <span className="font-medium">{transcript}</span>
          </p>
        </div>
      )}
      
      {processing && (
        <div className="p-3 bg-indigo-50 rounded-lg">
          <div className="flex items-center gap-2 text-indigo-600">
            <Loader2 className="h-4 w-4 animate-spin" />
            <p className="text-sm">Processing voice input...</p>
          </div>
        </div>
      )}

      {extractedScores.scores.length > 0 && (
        <div className="p-3 bg-green-50 rounded-lg">
          <div className="flex items-center gap-2 text-green-600 mb-2">
            <CheckCircle2 className="h-4 w-4" />
            <p className="text-sm font-medium">
              Detected Scores for Hole {extractedScores.round || currentRound}:
            </p>
          </div>
          <ul className="space-y-1">
            {extractedScores.scores.map(({ playerIndex, score }) => (
              <li key={playerIndex} className="text-sm text-green-600">
                {players[playerIndex]}: {score} points
              </li>
            ))}
          </ul>
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-50 rounded-lg">
          <div className="flex items-center gap-2 text-red-600">
            <AlertCircle className="h-4 w-4" />
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
};