import React from 'react';
import { Mic, Loader2, PenLine } from 'lucide-react';

interface PlayerIndicatorProps {
  currentRound: number;
  updatingRound?: number;
  listening: boolean;
  processing: boolean;
}

export const PlayerIndicator: React.FC<PlayerIndicatorProps> = ({ 
  currentRound,
  updatingRound,
  listening,
  processing 
}) => {
  return (
    <div className="flex items-center justify-between p-3 bg-surface-light bg-opacity-20 rounded-lg">
      <span className="text-text flex items-center gap-2">
        {updatingRound ? (
          <>
            <PenLine className="h-4 w-4 text-primary" />
            <span>Updating Hole <span className="font-medium">{updatingRound}</span></span>
          </>
        ) : (
          <>Current Hole: <span className="font-medium">{currentRound}</span></>
        )}
      </span>
      {listening && (
        <span className="flex items-center gap-2 text-red-400 text-sm">
          <Mic className="h-4 w-4 animate-pulse" />
          Listening...
        </span>
      )}
      {processing && (
        <span className="flex items-center gap-2 text-primary text-sm">
          <Loader2 className="h-4 w-4 animate-spin" />
          Processing...
        </span>
      )}
    </div>
  );
};