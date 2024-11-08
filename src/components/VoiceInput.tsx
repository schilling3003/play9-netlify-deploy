import React, { useState, useEffect, useRef } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { Instructions } from './Instructions';
import { PlayerIndicator } from './PlayerIndicator';
import { VoiceControls } from './VoiceControls';
import { ScoreDisplay } from './ScoreDisplay';
import { processVoiceInput } from '../lib/openai';

interface PlayerScore {
  playerIndex: number;
  score: number;
}

interface ProcessedScores {
  round?: number;
  scores: PlayerScore[];
}

interface VoiceInputProps {
  players: string[];
  currentRound: number;
  onScoreUpdate: (round: number, playerIndex: number, score: number) => void;
  onRoundComplete: () => void;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({
  players,
  currentRound,
  onScoreUpdate,
  onRoundComplete,
}) => {
  const [processing, setProcessing] = useState(false);
  const [extractedScores, setExtractedScores] = useState<ProcessedScores>({ scores: [] });
  const [error, setError] = useState<string | null>(null);
  const [pendingTranscript, setPendingTranscript] = useState<string | null>(null);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  useEffect(() => {
    if (!listening && transcript) {
      setPendingTranscript(transcript);
    }
  }, [transcript, listening]);

  useEffect(() => {
    if (pendingTranscript && !processing) {
      processTranscript(pendingTranscript);
      setPendingTranscript(null);
    }
  }, [pendingTranscript, processing]);

  const processTranscript = async (text: string) => {
    setProcessing(true);
    setError(null);
    try {
      const result = await processVoiceInput(text, players);
      if (result.scores.length > 0) {
        setExtractedScores(result);
      } else {
        setError("Couldn't detect any valid scores. Please try again.");
      }
    } catch (error) {
      console.error('Error processing transcript:', error);
      setError("An error occurred while processing the voice input.");
    }
    setProcessing(false);
  };

  const startListening = () => {
    resetTranscript();
    setPendingTranscript(null);
    setExtractedScores({ scores: [] });
    setError(null);
    SpeechRecognition.startListening({ continuous: true });
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
  };

  const handleSubmitScores = () => {
    if (extractedScores.scores.length > 0) {
      const round = extractedScores.round || currentRound;
      extractedScores.scores.forEach(({ playerIndex, score }) => {
        onScoreUpdate(round, playerIndex, score);
      });
      resetTranscript();
      setPendingTranscript(null);
      setExtractedScores({ scores: [] });
      setError(null);

      const allPlayersScored = players.every((_, index) => 
        extractedScores.scores.some(score => score.playerIndex === index)
      );
      
      if (allPlayersScored) {
        onRoundComplete();
      }
    }
  };

  if (!browserSupportsSpeechRecognition) {
    return (
      <div className="bg-red-900 bg-opacity-20 border border-red-500 rounded-xl p-4 text-red-400">
        Browser doesn't support speech recognition. Please try using a modern browser like Chrome.
      </div>
    );
  }

  return (
    <div className="golf-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text">Voice Input</h3>
        <Instructions />
      </div>

      <PlayerIndicator 
        currentRound={currentRound}
        updatingRound={extractedScores.round}
        listening={listening}
        processing={processing}
      />

      <div className="mt-4">
        <VoiceControls
          onStartListening={startListening}
          onStopListening={stopListening}
          onSubmitScore={handleSubmitScores}
          listening={listening}
          processing={processing}
          hasScore={extractedScores.scores.length > 0}
        />
      </div>

      <ScoreDisplay
        transcript={pendingTranscript || transcript}
        extractedScores={extractedScores}
        error={error}
        processing={processing}
        players={players}
        currentRound={currentRound}
      />
    </div>
  );
};