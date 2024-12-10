export interface ApiKey {
  id: string;
  key: string;
  name: string;
  provider?: string;
  createdAt: Date;
  totalTokens: number;
  usedTokens: number;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}