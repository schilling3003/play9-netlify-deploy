import { getSelectedModels, saveSelectedModels, MODEL_CHOICES, DefaultModels, DEFAULT_MODELS } from './models';
import { generateWelcomePrompt, generateSetupPrompt, generateScorePrompt } from './promptGenerators';

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

async function callOpenRouter(messages: any[], responseFormat?: { type: string }, modelOverride?: string) {
  const selectedModels = getSelectedModels();
  const model = modelOverride || selectedModels.welcomeMessage;
  
  console.log('Making OpenRouter API call with:', {
    model,
    apiKeyAvailable: !!OPENROUTER_API_KEY,
    messages,
    responseFormat
  });
  
  if (!OPENROUTER_API_KEY) {
    throw new Error('OpenRouter API key is not configured');
  }

  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': window.location.href,
        'X-Title': 'Play Nine Golf Card Game'
      },
      body: JSON.stringify({
        model,
        messages,
        response_format: responseFormat,
        temperature: 0
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter API error response:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(`OpenRouter API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    console.log('OpenRouter API response:', data);
    return data;
  } catch (error) {
    console.error('OpenRouter API call failed:', error);
    throw error;
  }
}

export const processVoiceInput = async (
  transcript: string,
  players: string[]
): Promise<{ round?: number; scores: Array<{ playerIndex: number; score: number }> }> => {
  try {
    const selectedModels = getSelectedModels();
    const { systemPrompt, userPrompt } = generateScorePrompt(players);
    
    const completion = await callOpenRouter([
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt(transcript) }
    ], { type: "json_object" }, selectedModels.scoreParsing);

    const response = JSON.parse(completion.choices[0].message.content);
    
    return {
      round: typeof response.round === 'number' && response.round >= 1 && response.round <= 9 
        ? response.round 
        : undefined,
      scores: Array.isArray(response.scores) 
        ? response.scores.filter(
            (score: any) => 
              typeof score.playerIndex === 'number' &&
              typeof score.score === 'number' &&
              score.playerIndex >= 0 &&
              score.playerIndex < players.length &&
              score.score >= -999 &&
              score.score <= 999
          )
        : []
    };
  } catch (error) {
    console.error('Error processing voice input:', error);
    return { scores: [] };
  }
};

export const processGameSetup = async (
  transcript: string
): Promise<{ players: string[] }> => {
  try {
    const selectedModels = getSelectedModels();
    const { systemPrompt, userPrompt } = generateSetupPrompt();
    
    const completion = await callOpenRouter([
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt(transcript) }
    ], { type: "json_object" }, selectedModels.setupParsing);

    const response = JSON.parse(completion.choices[0].message.content);
    
    if (!response.players || !Array.isArray(response.players) || response.players.length < 2 || response.players.length > 6) {
      throw new Error('Invalid number of players');
    }

    const validPlayers = response.players.filter(
      (name: any) => typeof name === 'string' && name.trim().length > 0
    );

    if (validPlayers.length !== response.players.length) {
      throw new Error('Invalid player names');
    }

    return { players: validPlayers };
  } catch (error) {
    console.error('Error processing game setup:', error);
    return { players: [] };
  }
};

export const generateWelcomeMessage = async (players: string[]): Promise<string> => {
  if (!players?.length) {
    throw new Error('No players provided');
  }

  try {
    const selectedModels = getSelectedModels();
    const { systemPrompt, userPrompt } = await generateWelcomePrompt(players, selectedModels);

    console.log('Generating welcome message with:', {
      players,
      selectedModel: selectedModels.welcomeMessage,
      welcomeSettings: selectedModels.welcomeSettings,
      systemPrompt
    });

    const completion = await callOpenRouter([
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ], undefined, selectedModels.welcomeMessage);

    if (!completion?.choices?.[0]?.message?.content) {
      console.error('Invalid response structure from OpenRouter:', completion);
      throw new Error('Invalid response from OpenRouter');
    }

    return completion.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error generating welcome message:', error);
    const playerList = players.length > 2
      ? `${players.slice(0, -1).join(', ')}, and ${players[players.length - 1]}`
      : players.join(' and ');
    return `Welcome to Play Nine, where ${players.length} golfers step up to the challenge! ${playerList}, prepare to tee off on this exciting card game adventure. May your scores be low and your spirits high!`;
  }
};

// Alias methods to match the expected function signatures
export const parseSetup = async (setupText: string) => {
  const result = await processGameSetup(setupText);
  return result;
};

export const parseScore = async (scoreText: string) => {
  // Note: This requires a list of players, so we'll use a default scenario
  const result = await processVoiceInput(scoreText, ['Player1', 'Player2']);
  return result;
};

export { DEFAULT_MODELS, getSelectedModels, saveSelectedModels, MODEL_CHOICES };
export type { DefaultModels };
