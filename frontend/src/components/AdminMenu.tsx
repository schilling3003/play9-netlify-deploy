import React, { useState } from 'react';
import { Settings, X } from 'lucide-react';
import LLMSelection from './LLMSelection/LLMSelection';
import { ModelTestInfo } from './ModelTestInfo';
import { PlayerFacts } from './PlayerFacts';

interface AdminMenuProps {
  onClose: () => void;
}

type TabType = 'llm' | 'test' | 'players';

export const AdminMenu: React.FC<AdminMenuProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<TabType>('llm');
  
  // Persistent state for Model Test Info
  const [welcomePlayer1, setWelcomePlayer1] = useState('');
  const [welcomePlayer2, setWelcomePlayer2] = useState('');
  const [setupInput, setSetupInput] = useState('');
  const [scoreInput, setScoreInput] = useState('');
  
  const [welcomeResult, setWelcomeResult] = useState('');
  const [setupResult, setSetupResult] = useState('');
  const [scoreResult, setScoreResult] = useState('');

  const modelTestInfoProps = {
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
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Settings className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold text-text">Secret Admin Menu</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="mb-6 border-b border-gray-200">
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab('llm')}
              className={`py-2 px-4 border-b-2 transition-colors ${
                activeTab === 'llm'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              LLM Selection
            </button>
            <button
              onClick={() => setActiveTab('test')}
              className={`py-2 px-4 border-b-2 transition-colors ${
                activeTab === 'test'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Model Test Info
            </button>
            <button
              onClick={() => setActiveTab('players')}
              className={`py-2 px-4 border-b-2 transition-colors ${
                activeTab === 'players'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Player Facts
            </button>
          </div>
        </div>

        {activeTab === 'llm' ? <LLMSelection modelTestInfoProps={modelTestInfoProps} /> :
         activeTab === 'test' ? <ModelTestInfo {...modelTestInfoProps} /> :
         activeTab === 'players' ? <PlayerFacts /> : null}
      </div>
    </div>
  );
};
