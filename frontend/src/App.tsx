import { useState } from 'react';
import { Header } from './components/Header';
import { VoiceInput } from './components/VoiceInput';
import { Scorecard } from './components/Scorecard';
import { PlayerSetup } from './components/PlayerSetup';
import { WelcomeMessage } from './components/WelcomeMessage';
import { GameHistory } from './components/GameHistory';
import { saveGame } from './lib/storage';
import { RotateCcw, History } from 'lucide-react';
import { useGamePersistence } from './hooks/useGamePersistence';

function App() {
  const {
    gameStarted,
    players,
    currentRound,
    scores,
    updateState,
    resetGame
  } = useGamePersistence();
  const [showHistory, setShowHistory] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);

  const handleGameStart = (playerNames: string[]) => {
    updateState({
      gameStarted: true,
      players: playerNames,
      scores: Array(9).fill([]).map(() => Array(playerNames.length).fill(0))
    });
    setShowWelcome(true);
  };

  const handleScoreUpdate = (round: number, playerIndex: number, score: number) => {
    const newScores = [...scores];
    newScores[round - 1] = [...newScores[round - 1]];
    newScores[round - 1][playerIndex] = score;
    updateState({ scores: newScores });
  };

  const handleRoundComplete = () => {
    if (currentRound < 9) {
      updateState({ currentRound: currentRound + 1 });
    } else {
      const finalTotals = players.map((_, playerIndex) => 
        scores.reduce((total, roundScores) => total + (roundScores[playerIndex] || 0), 0)
      );
      saveGame({
        playerNames: players,
        scores,
        finalTotals
      });
    }
  };

  const handleResetGame = () => {
    if (currentRound === 9) {
      const finalTotals = players.map((_, playerIndex) => 
        scores.reduce((total, roundScores) => total + (roundScores[playerIndex] || 0), 0)
      );
      saveGame({
        playerNames: players,
        scores,
        finalTotals
      });
    }
    resetGame();
    setShowHistory(false);
    setShowWelcome(false);
  };

  if (!gameStarted && !showHistory) {
    return (
      <div className="min-h-screen bg-background p-2 sm:p-4">
        <PlayerSetup onStart={handleGameStart} />
        <div className="mt-4 flex justify-center">
          <button
            onClick={() => setShowHistory(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-text rounded-lg transition-colors"
          >
            <History className="h-4 w-4" />
            View Game History
          </button>
        </div>
      </div>
    );
  }

  if (showHistory) {
    return (
      <div className="min-h-screen bg-background p-2 sm:p-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <button
              onClick={() => setShowHistory(false)}
              className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-text rounded-lg transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
              Back to Game
            </button>
          </div>
          <GameHistory />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-2 sm:p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {showWelcome && (
          <WelcomeMessage 
            players={players} 
            onSpeechEnd={() => setShowWelcome(false)} 
          />
        )}
        
        <div className="flex items-center justify-between">
          <Header 
            playerCount={players.length} 
            currentRound={currentRound} 
          />
          <div className="flex gap-2">
            <button
              onClick={() => setShowHistory(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-text rounded-lg transition-colors"
            >
              <History className="h-4 w-4" />
              History
            </button>
            <button
              onClick={handleResetGame}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
              End Game
            </button>
          </div>
        </div>

        <VoiceInput
          players={players}
          currentRound={currentRound}
          onScoreUpdate={handleScoreUpdate}
          onRoundComplete={handleRoundComplete}
        />

        <Scorecard
          players={players}
          scores={scores}
          currentRound={currentRound}
        />
      </div>
    </div>
  );
}

export default App;
