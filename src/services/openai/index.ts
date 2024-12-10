import OpenAI from 'openai';
import { Message, TokenUsage } from '../../types';
import { OPENAI_CONFIG } from './config';
import { validateApiKey } from '../../utils/validation';
import { handleOpenAIError } from './errors';
import { OpenAIResponse } from './types';

export async function createChatCompletion(
  apiKey: string,
  messages: Message[]
): Promise<OpenAIResponse> {
  // Validate API key before making the request
  if (!validateApiKey(apiKey)) {
    throw {
      type: 'invalid_key',
      message: 'Invalid API key format. Key must start with sk- and be 51 characters long.'
    };
  }

  try {
    const openai = new OpenAI({ apiKey });

    const response = await openai.chat.completions.create({
      model: OPENAI_CONFIG.defaultModel,
      messages: [
        { role: 'system', content: OPENAI_CONFIG.defaultSystemPrompt },
        ...messages.map(msg => ({
          role: msg.role,
          content: msg.content
        }))
      ],
      temperature: OPENAI_CONFIG.temperature,
      max_tokens: OPENAI_CONFIG.maxTokens,
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
    console.error('OpenAI API Error:', error);
    throw handleOpenAIError(error);
  }
}

export * from './types';