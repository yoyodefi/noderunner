import { z } from 'zod';

export const ModelProvider = {
  OPENAI: 'openai',
  ANTHROPIC: 'anthropic',
  GOOGLE: 'google',
} as const;

export const modelConfigSchema = z.object({
  id: z.string(),
  name: z.string(),
  provider: z.enum([ModelProvider.OPENAI, ModelProvider.ANTHROPIC, ModelProvider.GOOGLE]),
  contextWindow: z.number(),
  costPer1kTokens: z.number(),
  rateLimit: z.object({
    requestsPerMinute: z.number(),
    tokensPerMinute: z.number(),
  }),
});

export type ModelConfig = z.infer<typeof modelConfigSchema>;

export const AVAILABLE_MODELS: ModelConfig[] = [
  {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    provider: ModelProvider.OPENAI,
    contextWindow: 4096,
    costPer1kTokens: 0.002,
    rateLimit: {
      requestsPerMinute: 60,
      tokensPerMinute: 60000,
    },
  },
  {
    id: 'gpt-4',
    name: 'GPT-4',
    provider: ModelProvider.OPENAI,
    contextWindow: 8192,
    costPer1kTokens: 0.03,
    rateLimit: {
      requestsPerMinute: 40,
      tokensPerMinute: 40000,
    },
  },
  {
    id: 'claude-2',
    name: 'Claude 2',
    provider: ModelProvider.ANTHROPIC,
    contextWindow: 100000,
    costPer1kTokens: 0.01,
    rateLimit: {
      requestsPerMinute: 50,
      tokensPerMinute: 50000,
    },
  },
  {
    id: 'gemini-pro',
    name: 'Gemini Pro',
    provider: ModelProvider.GOOGLE,
    contextWindow: 32768,
    costPer1kTokens: 0.001,
    rateLimit: {
      requestsPerMinute: 60,
      tokensPerMinute: 60000,
    },
  },
];