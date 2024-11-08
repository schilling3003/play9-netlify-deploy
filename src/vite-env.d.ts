/// <reference types="vite/client" />

declare module './LLMSelection' {
  import React from 'react';

  interface ModelTestInfoProps {
    welcomePlayer1?: string;
    setWelcomePlayer1?: (value: string) => void;
    welcomePlayer2?: string;
    setWelcomePlayer2?: (value: string) => void;
    setupInput?: string;
    setSetupInput?: (value: string) => void;
    scoreInput?: string;
    setScoreInput?: (value: string) => void;
    welcomeResult?: string;
    setWelcomeResult?: (value: string) => void;
    setupResult?: string;
    setSetupResult?: (value: string) => void;
    scoreResult?: string;
    setScoreResult?: (value: string) => void;
  }

  interface LLMSelectionProps {
    modelTestInfoProps?: ModelTestInfoProps;
  }

  const LLMSelection: React.FC<LLMSelectionProps>;
  export default LLMSelection;
}
