import { ModelConfig } from '../config/models';

export interface ModelUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

export interface ModelCapability {
  modelId: string;
  rateLimit: {
    requestsPerMinute: number;
    tokensPerMinute: number;
  };
  performance?: {
    averageLatency?: number;
    successRate?: number;
  };
}

export interface ApiKeyMetadata {
  supportedModels: ModelCapability[];
  lastUsed: number;
  errorCount: number;
  rateLimitReset?: number;
  currentTokens: {
    [modelId: string]: number;
  };
}

export interface ModelResponse {
  message: {
    role: 'assistant';
    content: string;
  };
  usage: ModelUsage;
  model: string;
}