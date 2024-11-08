import { getPlayerFacts } from './db';
import { DefaultModels } from './models';

export const generateWelcomePrompt = async (players: string[], selectedModels: DefaultModels): Promise<{
  systemPrompt: string;
  userPrompt: string;
}> => {
  const playerFacts = await getPlayerFacts();
  const factMap = new Map(playerFacts.map(pf => [pf.playerName.toLowerCase(), pf.fact]));
  
  // Find players with facts
  const playersWithFacts = players.filter(player => factMap.has(player.toLowerCase()));
  
  let playerInfo = players.join(', ');
  
  // If we found players with facts, randomly select one to include
  if (playersWithFacts.length > 0) {
    const randomPlayer = playersWithFacts[Math.floor(Math.random() * playersWithFacts.length)];
    const fact = factMap.get(randomPlayer.toLowerCase());
    playerInfo = `${players.join(', ')} (Note about ${randomPlayer}: ${fact})`;
  }

  const systemPrompt = WELCOME_MESSAGE_PROMPT
    .replace('{length}', selectedModels.welcomeSettings.length)
    .replace('{tone}', selectedModels.welcomeSettings.tone)
    .replace('{playerInfo}', playerInfo);

  const userPrompt = `Generate a welcome message for ${players.length} players: ${playerInfo}`;

  return { systemPrompt, userPrompt };
};

export const generateSetupPrompt = (): {
  systemPrompt: string;
  userPrompt: (transcript: string) => string;
} => {
  return {
    systemPrompt: SETUP_PROCESSING_PROMPT,
    userPrompt: (transcript: string) => transcript
  };
};

export const generateScorePrompt = (players: string[]): {
  systemPrompt: string;
  userPrompt: (transcript: string) => string;
} => {
  return {
    systemPrompt: SCORE_PROCESSING_PROMPT.replace('{players}', players.join(', ')),
    userPrompt: (transcript: string) => transcript
  };
};

// Base prompts moved from prompts.ts
export const SCORE_PROCESSING_PROMPT = `You are a score tracking assistant that extracts player scores and hole/round numbers from voice transcripts.

Available players: {players}.

RULES:
1. Extract scores for each mentioned player
2. Match player names exactly (case-insensitive)
3. Convert all numbers (text or numeric) to integers
4. Scores must be between -999 and 999
5. Analyze the context to determine which score belongs to which player
6. If a hole/round number is mentioned (1-9), extract it
7. Handle various natural language patterns:
   - "Player score" format (e.g., "Tanner -23")
   - "score Player" format (e.g., "-23 Tanner")
   - "Hole X: Player score" format (e.g., "Hole 2: Tanner -23")
   - "Round X: Player score" format (e.g., "Round 2: Tanner -23")
   - "Descriptive format (e.g., "Tanner got -23")
   - Mixed formats in the same input

Return a JSON object with this format:
{
  "round": number | null,
  "scores": [
    { "playerIndex": number, "score": number }
  ]
}`;

export const SETUP_PROCESSING_PROMPT = `You are an assistant that extracts player information from natural language descriptions of game setups.

RULES:
1. Extract the number of players and their names
2. Names should be proper names (capitalized)
3. Support 2-6 players only
4. Remove any titles or honorifics
5. Use first names only
6. Handle name spelling clarifications (e.g., "Danny with an i" should be "Danni")
7. Ignore any other information

Return a JSON object with this format:
{
  "players": string[]
}`;

export const WELCOME_MESSAGE_PROMPT = `You are a golf announcer at an exclusive golf club. Generate a welcome message for a card game called Play Nine that matches the specified length and tone while incorporating player information.

MESSAGE LENGTH: {length}
- short: 1-2 concise sentences
- medium: 2-3 sentences with moderate detail
- long: 3-4 detailed sentences with extra flair (aka "John Mode")

TONE: {tone}
- professional: Formal and respectful, like a prestigious tournament
- casual: Laid-back and friendly, like a local golf club
- snarky: Witty and playfully mocking, with sharp humor
- enthusiastic: High-energy and excited, like a major championship
- dramatic: Over-the-top theatrical, like a movie trailer

RULES:
1. Match the specified length and tone exactly
2. Include all player names naturally in the message
3. If a player has a fact/note provided in parentheses, incorporate that information in a way that matches the chosen tone
4. Reference golf terminology in a way that fits the tone
5. End with a good luck wish that matches the tone
6. Keep the message engaging and appropriate for a card game setting

PLAYER INFO:
{playerInfo}`;

// UI descriptions
export const LENGTH_DESCRIPTIONS = {
  short: "Quick and to the point - perfect for fast-paced games",
  medium: "Balanced length with just the right amount of detail",
  long: "Extended and elaborate - full 'John Mode' experience"
};

export const TONE_DESCRIPTIONS = {
  professional: "Formal and dignified, like a prestigious tournament announcer",
  casual: "Relaxed and friendly, like your local golf club pro",
  snarky: "Witty and sharp, with playful roasts and clever jabs",
  enthusiastic: "High-energy and excited, bringing major championship vibes",
  dramatic: "Theatrical and intense, like a movie trailer narrator"
};
