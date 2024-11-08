import React from 'react';
import { generateWelcomeMessage, parseSetup, parseScore } from '../lib/openai';

interface ModelTestInfoProps {
  welcomePlayer1: string;
  setWelcomePlayer1: (value: string) => void;
  welcomePlayer2: string;
  setWelcomePlayer2: (value: string) => void;
  setupInput: string;
  setSetupInput: (value: string) => void;
  scoreInput: string;
  setScoreInput: (value: string) => void;
  welcomeResult: string;
  setWelcomeResult: (value: string) => void;
  setupResult: string;
  setSetupResult: (value: string) => void;
  scoreResult: string;
  setScoreResult: (value: string) => void;
}

export const ModelTestInfo: React.FC<ModelTestInfoProps> = ({
  welcomePlayer1,
  setWelcomePlayer1,
  welcomePlayer2,
  setWelcomePlayer2,
  setupInput,
  setSetupInput,
  scoreInput,
  setScoreInput,
  welcomeResult,
  setWelcomeResult,
  setupResult,
  setSetupResult,
  scoreResult,
  setScoreResult
}) => {
  const handleWelcomeTest = async () => {
    try {
      if (!welcomePlayer1 || !welcomePlayer2) {
        alert('Please enter names for both players');
        return;
      }
      const result = await generateWelcomeMessage([welcomePlayer1, welcomePlayer2]);
      setWelcomeResult(result);
      
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(result);
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      window.speechSynthesis.speak(utterance);
    } catch (error) {
      setWelcomeResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleSetupTest = async () => {
    try {
      if (!setupInput.trim()) {
        alert('Please enter setup information');
        return;
      }
      const result = await parseSetup(setupInput);
      setSetupResult(JSON.stringify(result, null, 2));
    } catch (error) {
      setSetupResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleScoreTest = async () => {
    try {
      if (!scoreInput.trim()) {
        alert('Please enter score information');
        return;
      }
      const result = await parseScore(scoreInput);
      setScoreResult(JSON.stringify(result, null, 2));
    } catch (error) {
      setScoreResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="p-4 space-y-6">
      {/* Welcome Message Test */}
      <div className="border p-4 rounded-lg">
        <h3 className="text-lg font-bold mb-4">Welcome Message Test</h3>
        <div className="flex space-x-2 mb-4">
          <input 
            type="text" 
            placeholder="Player 1 Name" 
            value={welcomePlayer1}
            onChange={(e) => setWelcomePlayer1(e.target.value)}
            className="input input-bordered w-1/2"
          />
          <input 
            type="text" 
            placeholder="Player 2 Name" 
            value={welcomePlayer2}
            onChange={(e) => setWelcomePlayer2(e.target.value)}
            className="input input-bordered w-1/2"
          />
        </div>
        <button 
          onClick={handleWelcomeTest} 
          className="btn btn-primary w-full"
        >
          Generate Welcome Message
        </button>
        {welcomeResult && (
          <div className="mt-4 p-2 bg-gray-100 rounded">
            <p className="text-sm">{welcomeResult}</p>
          </div>
        )}
      </div>

      {/* Setup Parsing Test */}
      <div className="border p-4 rounded-lg">
        <h3 className="text-lg font-bold mb-4">Setup Parsing Test</h3>
        <textarea 
          placeholder="Enter natural language setup (e.g., 'We want to play a game with John and Sarah')" 
          value={setupInput}
          onChange={(e) => setSetupInput(e.target.value)}
          className="textarea textarea-bordered w-full mb-4"
          rows={3}
        />
        <button 
          onClick={handleSetupTest} 
          className="btn btn-primary w-full"
        >
          Parse Setup
        </button>
        {setupResult && (
          <div className="mt-4 p-2 bg-gray-100 rounded">
            <pre className="text-sm">{setupResult}</pre>
          </div>
        )}
      </div>

      {/* Score Parsing Test */}
      <div className="border p-4 rounded-lg">
        <h3 className="text-lg font-bold mb-4">Score Parsing Test</h3>
        <textarea 
          placeholder="Enter natural language score (e.g., 'John scored a 4 on the first hole')" 
          value={scoreInput}
          onChange={(e) => setScoreInput(e.target.value)}
          className="textarea textarea-bordered w-full mb-4"
          rows={3}
        />
        <button 
          onClick={handleScoreTest} 
          className="btn btn-primary w-full"
        >
          Parse Score
        </button>
        {scoreResult && (
          <div className="mt-4 p-2 bg-gray-100 rounded">
            <pre className="text-sm">{scoreResult}</pre>
          </div>
        )}
      </div>
    </div>
  );
};
