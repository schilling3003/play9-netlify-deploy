import { useState } from 'react';
import { GameState, Player } from '../types';
import { getGames, saveGame } from '../lib/api';

const initialPlayers: Player[] = Array.from({ length: 4 }, (_, i) => ({
  id: i + 1,
  name: `Player ${i + 1}`,
  scores: [],
  total: 0,
}));

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>({
    players: initialPlayers,
    currentRound: 1,
    isListening: false,
    transcript: '',
    processing: false,
  });

  const updateScore = (playerIndex: number, score: number) => {
    setGameState((prev) => {
      const updatedPlayers = [...prev.players];
      const player = { ...updatedPlayers[playerIndex] };
      
      player.scores[prev.currentRound - 1] = score;
      player.total = player.scores.reduce((sum, s) => sum + (s || 0), 0);
      updatedPlayers[playerIndex] = player;

      const allScored = updatedPlayers.every(
        (p) => p.scores[prev.currentRound - 1] !== undefined
      );

      return {
        ...prev,
        players: updatedPlayers,
        currentRound: allScored ? Math.min(prev.currentRound + 1, 9) : prev.currentRound,
      };
    });
  };

  const saveCurrentGame = async () => {
    try {
      const { players, currentRound } = gameState;
      const game = {
        playerNames: players.map(p => p.name),
        scores: players.map(p => p.scores),
        finalTotals: players.map(p => p.total),
      };
      await saveGame(game);
      console.log('Game saved successfully');
    } catch (error) {
      console.error('Error saving game:', error);
    }
  };

  const setProcessing = (processing: boolean) => {
    setGameState((prev) => ({ ...prev, processing }));
  };

  const setIsListening = (isListening: boolean) => {
    setGameState((prev) => ({ ...prev, isListening }));
  };

  return {
    gameState,
    updateScore,
    saveCurrentGame,
    setProcessing,
    setIsListening,
  };
};
