import OpenAI from 'openai';
import { Message, TokenUsage } from '../types';
import { validateAndFormatApiKey, ApiKeyError } from '../utils/api-validation';

export async function createChatCompletion(
  apiKey: string,
  messages: Message[]
): Promise<{ message: Message; usage: TokenUsage }> {
  try {
    const validatedKey = validateAndFormatApiKey(apiKey);
    
    const openai = new OpenAI({ 
      apiKey: validatedKey, 
      dangerouslyAllowBrowser: true 
    });

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      temperature: 0.7,
      max_tokens: 1000,
    });

    if (!response.choices[0].message) {
      throw new Error('No response from OpenAI');
    }

    return {
      message: {
        role: 'assistant',
        content: response.choices[0].message.content || '',
      },
      usage: {
        promptTokens: response.usage?.prompt_tokens || 0,
        completionTokens: response.usage?.completion_tokens || 0,
        totalTokens: response.usage?.total_tokens || 0,
      },
    };
  } catch (error: any) {
    if (error instanceof ApiKeyError) {
      throw error;
    }
    
    console.error('OpenAI API Error:', error);
    throw new Error(
      error.response?.data?.error?.message || 
      error.message || 
      'Failed to communicate with OpenAI'
    );
  }
}