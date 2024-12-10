import { ApiKey } from '../types';
import { OpenAIError } from './openai/types';

interface KeyStatus {
  id: string;
  available: boolean;
  rateLimitReset?: number;
  errorCount: number;
  lastUsed: number;
  currentTokens: number;
}

export class KeyManager {
  private keyStatuses: Map<string, KeyStatus> = new Map();
  private readonly MAX_ERRORS = 3;
  private readonly ERROR_RESET_TIME = 5 * 60 * 1000; // 5 minutes
  private readonly TOKEN_RATE_LIMIT = 60000; // OpenAI's rate limit per minute
  private readonly MIN_AVAILABLE_TOKENS = 1000;

  constructor(apiKeys: ApiKey[]) {
    this.initializeKeys(apiKeys);
  }

  private initializeKeys(apiKeys: ApiKey[]) {
    apiKeys.forEach(key => {
      this.keyStatuses.set(key.id, {
        id: key.id,
        available: true,
        errorCount: 0,
        lastUsed: 0,
        currentTokens: 0
      });
    });
  }

  public selectKey(apiKeys: ApiKey[]): ApiKey | null {
    const now = Date.now();
    const availableKeys = apiKeys.filter(key => {
      const status = this.keyStatuses.get(key.id);
      if (!status) return false;

      // Check if key is available
      if (!status.available) {
        if (status.rateLimitReset && now > status.rateLimitReset) {
          status.available = true;
          status.currentTokens = 0;
        } else {
          return false;
        }
      }

      // Check error count
      if (status.errorCount >= this.MAX_ERRORS) {
        if (now - status.lastUsed > this.ERROR_RESET_TIME) {
          status.errorCount = 0;
        } else {
          return false;
        }
      }

      // Check remaining tokens
      const remainingTokens = key.totalTokens - key.usedTokens;
      return remainingTokens > this.MIN_AVAILABLE_TOKENS;
    });

    if (availableKeys.length === 0) return null;

    // Sort by least recently used and lowest token usage
    availableKeys.sort((a, b) => {
      const statusA = this.keyStatuses.get(a.id)!;
      const statusB = this.keyStatuses.get(b.id)!;
      
      // Prioritize keys with lower current token usage
      if (statusA.currentTokens !== statusB.currentTokens) {
        return statusA.currentTokens - statusB.currentTokens;
      }
      
      // Then by last used timestamp
      return statusA.lastUsed - statusB.lastUsed;
    });

    return availableKeys[0];
  }

  public handleSuccess(keyId: string, tokensUsed: number): void {
    const status = this.keyStatuses.get(keyId);
    if (!status) return;

    status.lastUsed = Date.now();
    status.currentTokens += tokensUsed;

    // Reset tokens count after a minute
    setTimeout(() => {
      const currentStatus = this.keyStatuses.get(keyId);
      if (currentStatus) {
        currentStatus.currentTokens = Math.max(0, currentStatus.currentTokens - tokensUsed);
      }
    }, 60000);
  }

  public handleError(keyId: string, error: OpenAIError): void {
    const status = this.keyStatuses.get(keyId);
    if (!status) return;

    status.lastUsed = Date.now();
    status.errorCount++;

    if (error.type === 'rate_limit') {
      status.available = false;
      status.rateLimitReset = Date.now() + 60000; // Reset after 1 minute
    }
  }
}