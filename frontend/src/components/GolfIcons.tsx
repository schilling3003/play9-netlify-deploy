import React from 'react';

interface IconProps {
  className?: string;
}

export const GolfBagIcon: React.FC<IconProps> = ({ className = "h-6 w-6" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M4 4h16v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4z" />
    <path d="M8 4V2" />
    <path d="M16 4V2" />
    <path d="M7 8h10" />
    <path d="M7 12h10" />
    <path d="M8 8v8" />
    <path d="M12 8v8" />
    <path d="M16 8v8" />
  </svg>
);

export const GolfFlagIcon: React.FC<IconProps> = ({ className = "h-6 w-6" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M4 2v20" />
    <path d="M4 3h12l4 4-4 4H4" />
  </svg>
);

export const GolfBallIcon: React.FC<IconProps> = ({ className = "h-6 w-6" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="8" />
    <path d="M10 10h.01" />
    <path d="M14 10h.01" />
    <path d="M10 14h.01" />
    <path d="M14 14h.01" />
  </svg>
);

export const GolfersIcon: React.FC<IconProps> = ({ className = "h-6 w-6" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M16 4a4 4 0 1 0-8 0 4 4 0 0 0 8 0z" />
    <path d="M12 12c-4 0-8 1.5-8 4v4h16v-4c0-2.5-4-4-8-4z" />
    <path d="M16 10l2-2" />
    <path d="M18 8l2 2" />
  </svg>
);
