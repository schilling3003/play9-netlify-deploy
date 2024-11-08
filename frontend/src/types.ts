export interface Player {
  id: number;
  name: string;
  scores: number[];
  total: number;
}

export interface GameState {
  players: Player[];
  currentRound: number;
  isListening: boolean;
  transcript: string;
  processing: boolean;
}

export interface GameHistory {
  id: string;
  date: string;
  playerCount: number;
  playerNames: string[];
  scores: number[][];
  finalTotals: number[];
}

export interface GameSummary {
  id: string;
  date: string;
  playerCount: number;
  scores: number[];
  finalTotals: number[];
  winner: {
    name: string;
    score: number;
  };
}

export interface PlayerFact {
  id?: number;
  playerName: string;
  fact: string;
  createdAt: Date;
}

export interface GameData {
  id: string;
  date: string;
  playerNames: string[];
  scores: number[][];
  finalTotals: number[];
}
