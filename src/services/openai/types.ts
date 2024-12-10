export interface OpenAIError {
  message: string;
  type: 'invalid_key' | 'rate_limit' | 'network' | 'unknown';
  originalError?: any;
}

export interface OpenAIResponse {
  message: {
    role: 'assistant';
    content: string;
  };
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}