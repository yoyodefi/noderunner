export * from './openai';
export * from './anthropic';
export * from './google';

export async function createCompletion(
  apiKey: string,
  provider: string,
  messages: Message[]
) {
  switch (provider) {
    case 'openai':
      return createOpenAICompletion(apiKey, messages);
    case 'anthropic':
      return createAnthropicCompletion(apiKey, messages);
    case 'google':
      return createGoogleCompletion(apiKey, messages);
    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }
}