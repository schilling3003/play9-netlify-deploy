import { useState, useEffect } from 'react';
import { getGames, saveGame, getPlayerFacts, savePlayerFact, deletePlayerFact } from '../lib/api';
import { GameData, PlayerFact } from '../types';

interface GameState {
  gameStarted: boolean;
  players: string[];
  currentRound: number;
  scores: number[][];
}

const INITIAL_STATE: GameState = {
  gameStarted: false,
  players: [],
  currentRound: 1,
  scores: []
};

export const useGamePersistence = () => {
  const [state, setState] = useState<GameState>(() => {
    const savedState = localStorage.getItem('currentGame');
    return savedState ? JSON.parse(savedState) : INITIAL_STATE;
  });

  const [games, setGames] = useState<GameData[]>([]);
  const [playerFacts, setPlayerFacts] = useState<PlayerFact[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  // Check server connectivity and fetch initial data
  useEffect(() => {
    const checkConnectivity = async () => {
      try {
        const [gamesData, factsData] = await Promise.all([
          getGames(),
          getPlayerFacts()
        ]);
        setGames(gamesData);
        setPlayerFacts(factsData);
        setIsConnected(true);
      } catch (error) {
        console.error('Server connection failed:', error);
        setIsConnected(false);
        // Load from localStorage only if server is unavailable
        const localGames = JSON.parse(localStorage.getItem('games') || '[]');
        const localFacts = JSON.parse(localStorage.getItem('playerFacts') || '[]');
        setGames(localGames);
        setPlayerFacts(localFacts);
      }
    };

    checkConnectivity();
    // Set up periodic connectivity check
    const interval = setInterval(checkConnectivity, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  // Only save current game state to localStorage
  useEffect(() => {
    localStorage.setItem('currentGame', JSON.stringify(state));
  }, [state]);

  // Only save to localStorage if server is unavailable
  useEffect(() => {
    if (!isConnected) {
      localStorage.setItem('games', JSON.stringify(games));
      localStorage.setItem('playerFacts', JSON.stringify(playerFacts));
    }
  }, [games, playerFacts, isConnected]);

  const updateState = (newState: Partial<GameState>) => {
    setState(prev => ({ ...prev, ...newState }));
  };

  const saveCurrentGame = async () => {
    const { players, currentRound, scores } = state;
    const game = {
      playerNames: players,
      scores: scores.slice(0, currentRound),
      finalTotals: scores.map(round => 
        round.reduce((sum, score) => sum + (score || 0), 0)
      ),
    };

    try {
      const savedGame = await saveGame(game);
      setGames(prev => [...prev, savedGame]);
      return savedGame;
    } catch (error) {
      console.error('Error saving game:', error);
      if (!isConnected) {
        // Only use localStorage fallback if server is unavailable
        const fallbackGame = {
          ...game,
          id: Date.now().toString(),
          date: new Date().toISOString().split('T')[0]
        };
        setGames(prev => [...prev, fallbackGame]);
        return fallbackGame;
      }
      throw error;
    }
  };

  const addPlayerFact = async (playerName: string, fact: string) => {
    const newFact: PlayerFact = {
      playerName,
      fact,
      createdAt: new Date()
    };
    
    try {
      const savedFact = await savePlayerFact(newFact);
      setPlayerFacts(prev => {
        const filtered = prev.filter(f => f.playerName !== playerName);
        return [...filtered, savedFact];
      });
      return savedFact;
    } catch (error) {
      console.error('Error saving player fact:', error);
      if (!isConnected) {
        // Only use localStorage fallback if server is unavailable
        setPlayerFacts(prev => {
          const filtered = prev.filter(f => f.playerName !== playerName);
          return [...filtered, newFact];
        });
        return newFact;
      }
      throw error;
    }
  };

  const removePlayerFact = async (playerName: string) => {
    try {
      await deletePlayerFact(playerName);
      setPlayerFacts(prev => prev.filter(fact => fact.playerName !== playerName));
    } catch (error) {
      console.error('Error deleting player fact:', error);
      if (!isConnected) {
        // Only use localStorage fallback if server is unavailable
        setPlayerFacts(prev => prev.filter(fact => fact.playerName !== playerName));
      } else {
        throw error;
      }
    }
  };

  const resetGame = async () => {
    setState(INITIAL_STATE);
    localStorage.removeItem('currentGame');
    
    // Refresh data from server
    try {
      const [gamesData, factsData] = await Promise.all([
        getGames(),
        getPlayerFacts()
      ]);
      setGames(gamesData);
      setPlayerFacts(factsData);
    } catch (error) {
      console.error('Error refreshing data:', error);
      if (!isConnected) {
        setGames([]);
        setPlayerFacts([]);
        localStorage.removeItem('games');
        localStorage.removeItem('playerFacts');
      }
    }
  };

  return {
    ...state,
    games,
    playerFacts,
    isConnected,
    updateState,
    saveCurrentGame,
    addPlayerFact,
    removePlayerFact,
    resetGame
  };
};
