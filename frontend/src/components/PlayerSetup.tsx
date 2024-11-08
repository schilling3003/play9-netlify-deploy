import React, { useState, useEffect, useRef } from 'react';
import { Mic, Loader2 } from 'lucide-react';
import { GolfBagIcon, GolfBallIcon } from './GolfIcons';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { processGameSetup } from '../lib/openai';
import { AdminMenu } from './AdminMenu';

interface PlayerSetupProps {
  onStart: (players: string[]) => void;
}

export const PlayerSetup: React.FC<PlayerSetupProps> = ({ onStart }) => {
  const [playerCount, setPlayerCount] = useState(2);
  const [playerNames, setPlayerNames] = useState<string[]>(Array(2).fill(''));
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAdminMenu, setShowAdminMenu] = useState(false);
  const [tapCount, setTapCount] = useState(0);
  const tapTimeoutRef = useRef<number>();

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  useEffect(() => {
    if (!listening && transcript) {
      handleVoiceInput();
    }
  }, [listening, transcript]);

  const handleIconTap = () => {
    setTapCount(prev => prev + 1);
    clearTimeout(tapTimeoutRef.current);
    
    tapTimeoutRef.current = window.setTimeout(() => {
      if (tapCount === 2) {
        setShowAdminMenu(true);
      }
      setTapCount(0);
    }, 500);
  };

  const handlePlayerCountChange = (count: number) => {
    console.log('Changing player count to:', count);
    setPlayerCount(count);
    setPlayerNames(prev => {
      const newNames = [...prev];
      if (count > prev.length) {
        return [...prev, ...Array(count - prev.length).fill('')];
      }
      return newNames.slice(0, count);
    });
  };

  const handleNameChange = (index: number, name: string) => {
    console.log(`Updating player ${index + 1} name to:`, name);
    setPlayerNames(prev => {
      const newNames = [...prev];
      newNames[index] = name;
      console.log('Updated player names:', newNames);
      return newNames;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted');
    console.log('Current player names:', playerNames);
    console.log('Player count:', playerCount);

    // Check if all player names are filled
    const validNames = playerNames.map(name => name.trim()).filter(Boolean);
    console.log('Valid names:', validNames);

    if (validNames.length === playerCount) {
      console.log('Starting game with players:', validNames);
      setError(null);
      onStart(validNames);
    } else {
      console.log('Form validation failed - missing player names');
      setError('Please enter names for all players');
    }
  };

  const startListening = () => {
    resetTranscript();
    setError(null);
    SpeechRecognition.startListening({ continuous: true });
  };

  const handleVoiceInput = async () => {
    if (!transcript) return;
    
    setProcessing(true);
    setError(null);
    
    try {
      const result = await processGameSetup(transcript);
      if (result.players.length >= 2 && result.players.length <= 6) {
        setPlayerCount(result.players.length);
        setPlayerNames(result.players);
      } else {
        setError("Please specify between 2 and 6 players.");
      }
    } catch (error) {
      console.error('Error processing game setup:', error);
      setError("Couldn't understand the player setup. Please try again or use manual input.");
    }
    
    setProcessing(false);
  };

  const renderManualInputForm = () => (
    <>
      <div>
        <label className="block text-sm font-medium text-text mb-2">
          Number of Players
        </label>
        <select
          value={playerCount}
          onChange={(e) => handlePlayerCountChange(Number(e.target.value))}
          className="input-golf"
        >
          {[2, 3, 4, 5, 6].map(num => (
            <option key={num} value={num} className="bg-surface">
              {num} Players
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-4">
        {playerNames.map((name, index) => (
          <div key={index}>
            <label className="block text-sm font-medium text-text mb-1">
              Player {index + 1}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => handleNameChange(index, e.target.value)}
              className="input-golf"
              placeholder={`Enter player ${index + 1} name`}
              required
            />
          </div>
        ))}
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
    </>
  );

  if (!browserSupportsSpeechRecognition) {
    return (
      <div className="container-golf">
        <div className="text-center mb-8">
          <div 
            className="inline-flex items-center justify-center w-20 h-20 mb-4 bg-primary rounded-full cursor-pointer transform hover:scale-105 transition-transform"
            onClick={handleIconTap}
          >
            <GolfBagIcon className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-text">Player Setup</h1>
          <p className="text-text-secondary mt-2">Enter player names to start the game</p>
        </div>

        <div className="bg-red-900/10 border border-red-500 rounded-xl p-4 mb-6">
          <p className="text-red-600 text-center">
            Voice input is not supported in this browser. Please use Chrome for voice features.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="golf-card p-6 space-y-6">
          {renderManualInputForm()}
          <button type="submit" className="btn-primary w-full">
            <GolfBallIcon className="h-5 w-5" />
            Start Game
          </button>
        </form>

        {showAdminMenu && <AdminMenu onClose={() => setShowAdminMenu(false)} />}
      </div>
    );
  }

  return (
    <div className="container-golf">
      <div className="text-center mb-8">
        <div 
          className="inline-flex items-center justify-center w-20 h-20 mb-4 bg-primary rounded-full cursor-pointer transform hover:scale-105 transition-transform"
          onClick={handleIconTap}
        >
          <GolfBagIcon className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-text">Player Setup</h1>
        <p className="text-text-secondary mt-2">Enter player names or describe your game</p>
      </div>

      <div className="space-y-6">
        <div className="golf-card p-6">
          <div className="flex flex-col gap-4">
            <button
              onClick={listening ? () => SpeechRecognition.stopListening() : startListening}
              disabled={processing}
              className={`btn-primary w-full ${listening ? 'bg-secondary' : ''}`}
            >
              {listening ? (
                <>
                  <Mic className="h-5 w-5 animate-pulse" />
                  Click to finish describing your game...
                </>
              ) : (
                <>
                  <Mic className="h-5 w-5" />
                  Tell me about your game
                </>
              )}
            </button>

            {transcript && (
              <div className="p-4 bg-accent-blue/10 rounded-xl border border-accent-blue/20">
                <p className="text-sm text-text-secondary italic">
                  "{transcript}"
                </p>
              </div>
            )}

            {processing && (
              <div className="flex items-center justify-center gap-2 text-primary p-4">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Processing...</span>
              </div>
            )}

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="golf-card p-6 space-y-6">
          {renderManualInputForm()}
          <button type="submit" className="btn-primary w-full">
            <GolfBallIcon className="h-5 w-5" />
            Start Game
          </button>
        </form>

        {showAdminMenu && <AdminMenu onClose={() => setShowAdminMenu(false)} />}
      </div>
    </div>
  );
};
