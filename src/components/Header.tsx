import React from 'react';
import { GolfFlagIcon, GolfersIcon } from './GolfIcons';

interface HeaderProps {
  playerCount: number;
  currentRound: number;
}

export const Header: React.FC<HeaderProps> = ({ playerCount, currentRound }) => {
  return (
    <div className="text-center">
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="bg-primary rounded-full p-3">
          <GolfFlagIcon className="h-8 w-8 text-text" />
        </div>
        <h1 className="text-3xl font-bold text-text">
          Play Nine
          <span className="block text-sm font-normal text-text-secondary mt-1">
            Golf Card Game
          </span>
        </h1>
      </div>
      <div className="inline-flex items-center gap-4 px-6 py-2 bg-surface rounded-full shadow-sm">
        <div className="flex items-center gap-2 text-text-secondary">
          <GolfersIcon className="h-5 w-5 text-secondary" />
          <p>{playerCount} Players</p>
        </div>
        <div className="w-px h-4 bg-surface-light"></div>
        <p className="text-text-secondary">
          Hole <span className="font-medium text-text">{currentRound}</span> of <span className="font-medium text-text">9</span>
        </p>
      </div>
    </div>
  );
};
