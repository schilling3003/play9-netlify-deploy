import React, { useState } from 'react';
import { Play } from 'lucide-react';
import { MODEL_CHOICES, getSelectedModels, saveSelectedModels, DefaultModels, WelcomeMessageSettings } from '../../lib/models';
import { generateWelcomeMessage, processGameSetup, processVoiceInput } from '../../lib/openai';
import { LENGTH_DESCRIPTIONS, TONE_DESCRIPTIONS } from '../../lib/promptGenerators';

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

interface Props {
  modelTestInfoProps?: ModelTestInfoProps;
}

const LLMSelection = ({ modelTestInfoProps }: Props) => {
  const [selectedModels, setSelectedModels] = useState<DefaultModels>(getSelectedModels());
  const [testResult, setTestResult] = useState<any>(null);

  const handleModelChange = (task: keyof DefaultModels, value: any) => {
    const newModels = { ...selectedModels };
    
    if (task === 'welcomeSettings') {
      newModels.welcomeSettings = {
        ...newModels.welcomeSettings,
        ...(value as WelcomeMessageSettings)
      };
    } else {
      newModels[task] = value;
    }
    
    setSelectedModels(newModels);
    saveSelectedModels(newModels);
  };

  const handleTestModel = async (task: keyof DefaultModels) => {
    try {
      switch (task) {
        case 'welcomeMessage':
          const players = modelTestInfoProps 
            ? [
                modelTestInfoProps.welcomePlayer1 || 'Player1', 
                modelTestInfoProps.welcomePlayer2 || 'Player2'
              ]
            : ['Tanner', 'Danni'];

          const welcomeMessage = await generateWelcomeMessage(players);
          setTestResult(welcomeMessage);

          if (modelTestInfoProps?.setWelcomeResult) {
            modelTestInfoProps.setWelcomeResult(welcomeMessage);
          }
          break;

        case 'setupParsing':
          const setupInput = modelTestInfoProps?.setupInput || 'The players are Tanner, Danni, and Ethan.';
          const setupResult = await processGameSetup(setupInput);
          setTestResult(setupResult.players);

          if (modelTestInfoProps?.setSetupResult) {
            modelTestInfoProps.setSetupResult(JSON.stringify(setupResult.players));
          }
          break;

        case 'scoreParsing':
          const scoreInput = modelTestInfoProps?.scoreInput || 'Tanner got -23, Danni scored 15, and Ethan had a 7.';
          const scoreResult = await processVoiceInput(
            scoreInput, 
            ['Tanner', 'Danni', 'Ethan']
          );
          setTestResult(scoreResult);

          if (modelTestInfoProps?.setScoreResult) {
            modelTestInfoProps.setScoreResult(JSON.stringify(scoreResult));
          }
          break;
      }
    } catch (error) {
      console.error('Error testing model:', error);
      setTestResult(null);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h4 className="text-lg font-semibold text-text mb-4">Welcome Message Settings</h4>
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-text mb-2">Message Length</label>
            <select
              value={selectedModels.welcomeSettings.length}
              onChange={(e) => handleModelChange('welcomeSettings', { 
                ...selectedModels.welcomeSettings, 
                length: e.target.value as WelcomeMessageSettings['length']
              })}
              className="w-full p-2 border rounded-md bg-white"
            >
              <option value="short">Short - {LENGTH_DESCRIPTIONS.short}</option>
              <option value="medium">Medium - {LENGTH_DESCRIPTIONS.medium}</option>
              <option value="long">Long (John Mode) - {LENGTH_DESCRIPTIONS.long}</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-2">Message Tone</label>
            <select
              value={selectedModels.welcomeSettings.tone}
              onChange={(e) => handleModelChange('welcomeSettings', { 
                ...selectedModels.welcomeSettings, 
                tone: e.target.value as WelcomeMessageSettings['tone']
              })}
              className="w-full p-2 border rounded-md bg-white"
            >
              <option value="professional">Professional - {TONE_DESCRIPTIONS.professional}</option>
              <option value="casual">Casual - {TONE_DESCRIPTIONS.casual}</option>
              <option value="snarky">Snarky - {TONE_DESCRIPTIONS.snarky}</option>
              <option value="enthusiastic">Enthusiastic - {TONE_DESCRIPTIONS.enthusiastic}</option>
              <option value="dramatic">Dramatic - {TONE_DESCRIPTIONS.dramatic}</option>
            </select>
          </div>
        </div>

        <h4 className="text-lg font-semibold text-text mb-4">Welcome Message Generation</h4>
        <div className="space-y-4">
          {MODEL_CHOICES.welcomeMessage.map((model) => (
            <div key={model.id} className="flex items-start space-x-3">
              <input
                type="radio"
                id={`welcome-${model.id}`}
                name="welcomeMessage"
                value={model.id}
                checked={selectedModels.welcomeMessage === model.id}
                onChange={(e) => handleModelChange('welcomeMessage', e.target.value)}
                className="mt-1"
              />
              <label htmlFor={`welcome-${model.id}`} className="flex-1">
                <div className="font-medium text-text">
                  {model.name}
                  <a 
                    href={model.link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="ml-2 text-primary text-sm hover:underline"
                  >
                    View on OpenRouter
                  </a>
                </div>
                <div className="text-sm text-text-secondary">{model.description}</div>
                <div className="text-xs text-primary mt-1">{model.pricing}</div>
              </label>
            </div>
          ))}
        </div>
        <button
          onClick={() => handleTestModel('welcomeMessage')}
          className="btn-primary mt-4"
        >
          <Play className="h-5 w-5 mr-2" />
          Test Welcome Message
        </button>
      </div>

      <div>
        <h4 className="text-lg font-semibold text-text mb-4">Player Setup Parsing</h4>
        <div className="space-y-4">
          {MODEL_CHOICES.setupParsing.map((model) => (
            <div key={model.id} className="flex items-start space-x-3">
              <input
                type="radio"
                id={`setup-${model.id}`}
                name="setupParsing"
                value={model.id}
                checked={selectedModels.setupParsing === model.id}
                onChange={(e) => handleModelChange('setupParsing', e.target.value)}
                className="mt-1"
              />
              <label htmlFor={`setup-${model.id}`} className="flex-1">
                <div className="font-medium text-text">
                  {model.name}
                  <a 
                    href={model.link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="ml-2 text-primary text-sm hover:underline"
                  >
                    View on OpenRouter
                  </a>
                </div>
                <div className="text-sm text-text-secondary">{model.description}</div>
                <div className="text-xs text-primary mt-1">{model.pricing}</div>
              </label>
            </div>
          ))}
        </div>
        <button
          onClick={() => handleTestModel('setupParsing')}
          className="btn-primary mt-4"
        >
          <Play className="h-5 w-5 mr-2" />
          Test Setup Parsing
        </button>
      </div>

      <div>
        <h4 className="text-lg font-semibold text-text mb-4">Score Parsing</h4>
        <div className="space-y-4">
          {MODEL_CHOICES.scoreParsing.map((model) => (
            <div key={model.id} className="flex items-start space-x-3">
              <input
                type="radio"
                id={`score-${model.id}`}
                name="scoreParsing"
                value={model.id}
                checked={selectedModels.scoreParsing === model.id}
                onChange={(e) => handleModelChange('scoreParsing', e.target.value)}
                className="mt-1"
              />
              <label htmlFor={`score-${model.id}`} className="flex-1">
                <div className="font-medium text-text">
                  {model.name}
                  <a 
                    href={model.link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="ml-2 text-primary text-sm hover:underline"
                  >
                    View on OpenRouter
                  </a>
                </div>
                <div className="text-sm text-text-secondary">{model.description}</div>
                <div className="text-xs text-primary mt-1">{model.pricing}</div>
              </label>
            </div>
          ))}
        </div>
        <button
          onClick={() => handleTestModel('scoreParsing')}
          className="btn-primary mt-4"
        >
          <Play className="h-5 w-5 mr-2" />
          Test Score Parsing
        </button>
      </div>

      {testResult && (
        <div className="mt-8 bg-gray-50 p-4 rounded-lg">
          <h4 className="text-lg font-semibold text-text mb-2">Test Result:</h4>
          <pre className="text-sm text-text-secondary">{JSON.stringify(testResult, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default LLMSelection;
