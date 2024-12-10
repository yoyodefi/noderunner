import { z } from 'zod';

export const openAiKeyPattern = /^sk-[a-zA-Z0-9]{48}$/;

export function validateApiKey(key: string): boolean {
  return openAiKeyPattern.test(key);
}

export function formatApiKeyError(key: string): string {
  if (!key.startsWith('sk-')) {
    return 'API key must start with "sk-"';
  }
  if (key.length !== 51) {
    return 'API key must be exactly 51 characters long';
  }
  return 'Invalid API key format';
}