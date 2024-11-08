export interface ModelChoice {
  id: string;
  name: string;
  description: string;
  pricing: string;
  link: string;
}

export interface ModelChoices {
  welcomeMessage: ModelChoice[];
  setupParsing: ModelChoice[];
  scoreParsing: ModelChoice[];
}

export interface WelcomeMessageSettings {
  length: 'short' | 'medium' | 'long';
  tone: 'professional' | 'casual' | 'snarky' | 'enthusiastic' | 'dramatic';
}

export interface DefaultModels {
  welcomeMessage: string;
  setupParsing: string;
  scoreParsing: string;
  welcomeSettings: WelcomeMessageSettings;
}

// Default models if none are selected
export const DEFAULT_MODELS: DefaultModels = {
  welcomeMessage: 'anthropic/claude-3-opus',
  setupParsing: 'meta-llama/llama-3.1-8b-instruct',
  scoreParsing: 'meta-llama/llama-3.1-8b-instruct',
  welcomeSettings: {
    length: 'medium',
    tone: 'snarky'
  }
};

// Available model choices for each task
export const MODEL_CHOICES: ModelChoices = {
  welcomeMessage: [
    { 
      id: 'anthropic/claude-3-opus',
      name: 'Claude 3 Opus',
      description: 'Most capable model for creative writing (200K context, 1.5T parameters). Excellent at crafting engaging, contextually aware welcome messages.',
      pricing: 'Input: $15/M tokens, Output: $75/M tokens',
      link: 'https://openrouter.ai/docs#claude-3-opus'
    },
    { 
      id: 'anthropic/claude-3-sonnet',
      name: 'Claude 3 Sonnet',
      description: 'Strong balance of quality and cost (200K context, 750B parameters). Great at creative writing with slightly lower cost than Opus.',
      pricing: 'Input: $3/M tokens, Output: $15/M tokens',
      link: 'https://openrouter.ai/docs#claude-3-sonnet'
    },
    { 
      id: 'gpt-4-turbo',
      name: 'GPT-4 Turbo',
      description: 'Highly capable at creative tasks (128K context, estimated 1.7T parameters) with good personality adaptation.',
      pricing: 'Input: $10/M tokens, Output: $30/M tokens',
      link: 'https://openrouter.ai/docs#gpt-4-turbo'
    },
    { 
      id: 'meta-llama/llama-3.1-8b-instruct',
      name: 'Llama 3.1 (8B)',
      description: 'Cost-effective option with good creative capabilities (8B parameters).',
      pricing: 'Input: $0.25/M tokens, Output: $0.75/M tokens',
      link: 'https://openrouter.ai/docs#llama-3-8b'
    },
    {
      id: 'meta-llama/llama-3.1-70b-instruct',
      name: 'Llama 3.1 (70B)',
      description: 'Balanced option with improved capabilities (70B parameters).',
      pricing: 'Input: $1/M tokens, Output: $3/M tokens',
      link: 'https://openrouter.ai/docs#llama-3-70b'
    },
    {
      id: 'meta-llama/llama-3.2-instruct',
      name: 'Llama 3.2',
      description: 'Latest version with enhanced performance (estimated 175B parameters).',
      pricing: 'Input: $2/M tokens, Output: $6/M tokens',
      link: 'https://openrouter.ai/docs#llama-3-2'
    },
    {
      id: 'anthropic/claude-3-haiku',
      name: 'Claude 3 Haiku',
      description: 'Fast and efficient (200K context, 70B parameters). Good balance of quality and cost for simpler messages.',
      pricing: 'Input: $0.25/M tokens, Output: $1.25/M tokens',
      link: 'https://openrouter.ai/docs#claude-3-haiku'
    },
    {
      id: 'google/gemini-pro',
      name: 'Gemini Pro',
      description: 'Strong creative writing capabilities (32K context, estimated 250B parameters) with competitive pricing.',
      pricing: 'Input: $0.25/M tokens, Output: $0.75/M tokens',
      link: 'https://openrouter.ai/docs#gemini-pro'
    }
  ],
  setupParsing: [
    { 
      id: 'meta-llama/llama-3.1-8b-instruct',
      name: 'Llama 3.1 (8B)',
      description: 'Best for structured output (8B parameters). Excellent at parsing player names and setup information.',
      pricing: 'Input: $0.25/M tokens, Output: $0.75/M tokens',
      link: 'https://openrouter.ai/docs#llama-3-8b'
    },
    { 
      id: 'meta-llama/llama-3.1-70b-instruct',
      name: 'Llama 3.1 (70B)',
      description: 'Improved parsing capabilities (70B parameters).',
      pricing: 'Input: $1/M tokens, Output: $3/M tokens',
      link: 'https://openrouter.ai/docs#llama-3-70b'
    },
    { 
      id: 'meta-llama/llama-3.2-instruct',
      name: 'Llama 3.2',
      description: 'Latest version with enhanced parsing (estimated 175B parameters).',
      pricing: 'Input: $2/M tokens, Output: $6/M tokens',
      link: 'https://openrouter.ai/docs#llama-3-2'
    },
    { 
      id: 'anthropic/claude-3-haiku',
      name: 'Claude 3 Haiku',
      description: 'Fast and accurate for parsing tasks (70B parameters). Great cost-performance ratio.',
      pricing: 'Input: $0.25/M tokens, Output: $1.25/M tokens',
      link: 'https://openrouter.ai/docs#claude-3-haiku'
    },
    { 
      id: 'gpt-3.5-turbo',
      name: 'GPT-3.5 Turbo',
      description: 'Reliable parsing with good accuracy (175B parameters) and low cost.',
      pricing: 'Input: $0.5/M tokens, Output: $1.5/M tokens',
      link: 'https://openrouter.ai/docs#gpt-3.5-turbo'
    },
    {
      id: 'google/gemini-pro',
      name: 'Gemini Pro',
      description: 'Strong at structured data extraction (estimated 250B parameters) with competitive pricing.',
      pricing: 'Input: $0.25/M tokens, Output: $0.75/M tokens',
      link: 'https://openrouter.ai/docs#gemini-pro'
    },
    {
      id: 'mistral/mistral-medium',
      name: 'Mistral Medium',
      description: 'Efficient at parsing with good accuracy (7B parameters) and low cost.',
      pricing: 'Input: $0.2/M tokens, Output: $0.6/M tokens',
      link: 'https://openrouter.ai/docs#mistral-medium'
    }
  ],
  scoreParsing: [
    { 
      id: 'meta-llama/llama-3.1-8b-instruct',
      name: 'Llama 3.1 (8B)',
      description: 'Best for number parsing (8B parameters). Excellent at extracting scores and round numbers.',
      pricing: 'Input: $0.25/M tokens, Output: $0.75/M tokens',
      link: 'https://openrouter.ai/docs#llama-3-8b'
    },
    { 
      id: 'meta-llama/llama-3.1-70b-instruct',
      name: 'Llama 3.1 (70B)',
      description: 'Improved score parsing capabilities (70B parameters).',
      pricing: 'Input: $1/M tokens, Output: $3/M tokens',
      link: 'https://openrouter.ai/docs#llama-3-70b'
    },
    { 
      id: 'meta-llama/llama-3.2-instruct',
      name: 'Llama 3.2',
      description: 'Latest version with enhanced score parsing (estimated 175B parameters).',
      pricing: 'Input: $2/M tokens, Output: $6/M tokens',
      link: 'https://openrouter.ai/docs#llama-3-2'
    },
    { 
      id: 'anthropic/claude-3-haiku',
      name: 'Claude 3 Haiku',
      description: 'Fast and precise for numerical extraction (70B parameters). Great for real-time score updates.',
      pricing: 'Input: $0.25/M tokens, Output: $1.25/M tokens',
      link: 'https://openrouter.ai/docs#claude-3-haiku'
    },
    { 
      id: 'gpt-3.5-turbo',
      name: 'GPT-3.5 Turbo',
      description: 'Reliable score parsing with good accuracy (175B parameters) and low cost.',
      pricing: 'Input: $0.5/M tokens, Output: $1.5/M tokens',
      link: 'https://openrouter.ai/docs#gpt-3.5-turbo'
    },
    {
      id: 'google/gemini-pro',
      name: 'Gemini Pro',
      description: 'Strong at numerical extraction (estimated 250B parameters) with competitive pricing.',
      pricing: 'Input: $0.25/M tokens, Output: $0.75/M tokens',
      link: 'https://openrouter.ai/docs#gemini-pro'
    },
    {
      id: 'mistral/mistral-medium',
      name: 'Mistral Medium',
      description: 'Efficient at score parsing with good accuracy (7B parameters) and low cost.',
      pricing: 'Input: $0.2/M tokens, Output: $0.6/M tokens',
      link: 'https://openrouter.ai/docs#mistral-medium'
    }
  ]
};

// Get currently selected models from localStorage or use defaults
export const getSelectedModels = (): DefaultModels => {
  try {
    const stored = localStorage.getItem('selectedModels');
    if (stored) {
      const parsed = JSON.parse(stored);
      // Ensure welcomeSettings exists with default values if missing
      if (!parsed.welcomeSettings) {
        parsed.welcomeSettings = DEFAULT_MODELS.welcomeSettings;
      }
      return parsed;
    }
    return DEFAULT_MODELS;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return DEFAULT_MODELS;
  }
};

// Save selected models to localStorage
export const saveSelectedModels = (models: DefaultModels): void => {
  try {
    localStorage.setItem('selectedModels', JSON.stringify(models));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};
