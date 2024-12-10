import { GoogleGenerativeAI } from '@google/generative-ai';
import { Message, TokenUsage } from '../../types';
import { validateAndFormatApiKey } from '../../utils/api-validation';

export async function createGoogleCompletion(
  apiKey: string,
  messages: Message[]
): Promise<{ message: Message; usage: TokenUsage }> {
  const validatedKey = validateAndFormatApiKey(apiKey);
  
  const genAI = new GoogleGenerativeAI(validatedKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  const history = messages.map(msg => ({
    role: msg.role,
    parts: [{ text: msg.content }],
  }));

  const chat = model.startChat({
    history,
  });

  const result = await chat.sendMessage(messages[messages.length - 1].content);
  const response = await result.response;
  const content = response.text();

  // Google doesn't provide token usage, estimate based on characters
  const totalTokens = Math.ceil((content.length + messages.join('').length) / 4);

  return {
    message: {
      role: 'assistant',
      content,
    },
    usage: {
      promptTokens: Math.ceil(messages.join('').length / 4),
      completionTokens: Math.ceil(content.length / 4),
      totalTokens,
    },
  };
}