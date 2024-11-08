import React from 'react';
import { Mic, MicOff, Send, Loader2 } from 'lucide-react';

interface VoiceControlsProps {
  onStartListening: () => void;
  onStopListening: () => void;
  onSubmitScore: () => void;
  listening: boolean;
  processing: boolean;
  hasScore: boolean;
}

export const VoiceControls: React.FC<VoiceControlsProps> = ({
  onStartListening,
  onStopListening,
  onSubmitScore,
  listening,
  processing,
  hasScore,
}) => {
  return (
    <div className="flex gap-4">
      {!listening ? (
        <button
          onClick={onStartListening}
          disabled={processing}
          className="flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors disabled:opacity-50"
        >
          <Mic className="h-5 w-5" />
          Tell me your scores
        </button>
      ) : (
        <button
          onClick={onStopListening}
          disabled={processing}
          className="flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50"
        >
          <MicOff className="h-5 w-5" />
          Stop Recording
        </button>
      )}

      <button
        onClick={onSubmitScore}
        disabled={!hasScore || listening || processing}
        className="flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors disabled:opacity-50"
      >
        {processing ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <Send className="h-5 w-5" />
        )}
        Submit Score
      </button>
    </div>
  );
};