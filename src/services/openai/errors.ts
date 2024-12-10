import { OpenAIError } from './types';

export function handleOpenAIError(error: any): OpenAIError {
  if (error.response?.status === 401) {
    return {
      type: 'invalid_key',
      message: 'Invalid API key. Please check your OpenAI API key and try again.',
      originalError: error
    };
  }

  if (error.response?.status === 429) {
    return {
      type: 'rate_limit',
      message: 'Rate limit exceeded. Please try again later.',
      originalError: error
    };
  }

  if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
    return {
      type: 'network',
      message: 'Network error. Please check your internet connection.',
      originalError: error
    };
  }

  return {
    type: 'unknown',
    message: error.message || 'An unexpected error occurred',
    originalError: error
  };
}