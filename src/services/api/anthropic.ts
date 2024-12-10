import Anthropic from '@anthropic-ai/sdk';
import { Message, TokenUsage } from '../../types';
import { validateAndFormatApiKey } from '../../utils/api-validation';

export async function createAnthropicCompletion(
  apiKey: string,
  messages: Message[]
): Promise<{ message: Message; usage: TokenUsage }> {
  const validatedKey = validateAndFormatApiKey(apiKey);
  
  const anthropic = new Anthropic({
    apiKey: validatedKey,
  });

  // Convert messages to Anthropic format
  const prompt = messages
    .map(msg => `\n\n${msg.role === 'user' ? 'Human' : 'Assistant'}: ${msg.content}`)
    .join('') + '\n\nAssistant:';

  const response = await anthropic.messages.create({
    model: 'claude-2',
    max_tokens: 1000,
    messages: [{ role: 'user', content: prompt }],
  });

  // Anthropic doesn't provide detailed token usage, estimate based on characters
  const totalTokens = Math.ceil((prompt.length + (response.content || '').length) / 4);

  return {
    message: {
      role: 'assistant',
      content: response.content || '',
    },
    usage: {
      promptTokens: Math.ceil(prompt.length / 4),
      completionTokens: Math.ceil((response.content || '').length / 4),
      totalTokens,
    },
  };
}