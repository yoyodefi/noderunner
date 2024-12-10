export const API_KEY_PATTERNS = {
  OPENAI: /^sk-[A-Za-z0-9]{48}$/,
  ANTHROPIC: /^anthropic-[A-Za-z0-9]{48}$/,
  GOOGLE: /^AIza[A-Za-z0-9-_]{35}$/,
};

export class ApiKeyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ApiKeyError';
  }
}

export function detectProvider(key: string): string | null {
  if (API_KEY_PATTERNS.OPENAI.test(key)) return 'openai';
  if (API_KEY_PATTERNS.ANTHROPIC.test(key)) return 'anthropic';
  if (API_KEY_PATTERNS.GOOGLE.test(key)) return 'google';
  return null;
}

export function validateApiKey(key: string): boolean {
  return Object.values(API_KEY_PATTERNS).some(pattern => pattern.test(key));
}

export function validateAndFormatApiKey(apiKey: string): string {
  const trimmedKey = apiKey.trim();
  
  if (!validateApiKey(trimmedKey)) {
    throw new ApiKeyError('Invalid API key format. Please check your API key format.');
  }

  return trimmedKey;
}