import { ApiKey } from '../types';
import { ModelConfig, AVAILABLE_MODELS } from '../config/models';
import { ApiKeyMetadata, ModelCapability } from '../types/models';
import { OpenAIError } from './openai/types';

export class ModelRouter {
  private keyMetadata: Map<string, ApiKeyMetadata> = new Map();
  private readonly ERROR_THRESHOLD = 3;
  private readonly ERROR_RESET_TIME = 5 * 60 * 1000; // 5 minutes
  private readonly MIN_TOKENS_BUFFER = 1000;

  constructor(apiKeys: ApiKey[]) {
    apiKeys.forEach(key => {
      // Initialize metadata for each key
      this.keyMetadata.set(key.id, {
        supportedModels: this.detectSupportedModels(key),
        lastUsed: 0,
        errorCount: 0,
        currentTokens: {},
      });
    });
  }

  private detectSupportedModels(key: ApiKey): ModelCapability[] {
    // Detect which models this key supports based on the key format
    if (key.key.startsWith('sk-')) {
      return AVAILABLE_MODELS
        .filter(model => model.provider === 'openai')
        .map(model => ({
          modelId: model.id,
          rateLimit: model.rateLimit,
        }));
    } else if (key.key.startsWith('anthropic-')) {
      return AVAILABLE_MODELS
        .filter(model => model.provider === 'anthropic')
        .map(model => ({
          modelId: model.id,
          rateLimit: model.rateLimit,
        }));
    } else if (key.key.startsWith('AIza')) {
      return AVAILABLE_MODELS
        .filter(model => model.provider === 'google')
        .map(model => ({
          modelId: model.id,
          rateLimit: model.rateLimit,
        }));
    }
    return [];
  }

  public selectKeyForModel(
    modelId: string,
    apiKeys: ApiKey[],
  ): { key: ApiKey; model: ModelConfig } | null {
    const model = AVAILABLE_MODELS.find(m => m.id === modelId);
    if (!model) return null;

    const now = Date.now();
    const availableKeys = apiKeys.filter(key => {
      const metadata = this.keyMetadata.get(key.id);
      if (!metadata) return false;

      // Check if key supports the model
      const modelCapability = metadata.supportedModels.find(m => m.modelId === modelId);
      if (!modelCapability) return false;

      // Check error count
      if (metadata.errorCount >= this.ERROR_THRESHOLD) {
        if (now - metadata.lastUsed > this.ERROR_RESET_TIME) {
          metadata.errorCount = 0;
        } else {
          return false;
        }
      }

      // Check rate limits
      const currentTokens = metadata.currentTokens[modelId] || 0;
      if (currentTokens >= modelCapability.rateLimit.tokensPerMinute) {
        if (metadata.rateLimitReset && now > metadata.rateLimitReset) {
          metadata.currentTokens[modelId] = 0;
        } else {
          return false;
        }
      }

      // Check remaining tokens
      const remainingTokens = key.totalTokens - key.usedTokens;
      return remainingTokens > this.MIN_TOKENS_BUFFER;
    });

    if (availableKeys.length === 0) return null;

    // Sort by optimal key selection
    availableKeys.sort((a, b) => {
      const metadataA = this.keyMetadata.get(a.id)!;
      const metadataB = this.keyMetadata.get(b.id)!;

      // Prioritize keys with better performance for this model
      const perfA = metadataA.supportedModels.find(m => m.modelId === modelId)?.performance;
      const perfB = metadataB.supportedModels.find(m => m.modelId === modelId)?.performance;

      if (perfA && perfB) {
        if (perfA.successRate !== perfB.successRate) {
          return (perfB.successRate || 0) - (perfA.successRate || 0);
        }
      }

      // Then by current token usage
      const tokensA = metadataA.currentTokens[modelId] || 0;
      const tokensB = metadataB.currentTokens[modelId] || 0;
      if (tokensA !== tokensB) {
        return tokensA - tokensB;
      }

      // Finally by last used timestamp
      return metadataA.lastUsed - metadataB.lastUsed;
    });

    return {
      key: availableKeys[0],
      model,
    };
  }

  public handleSuccess(keyId: string, modelId: string, tokensUsed: number, latencyMs: number): void {
    const metadata = this.keyMetadata.get(keyId);
    if (!metadata) return;

    metadata.lastUsed = Date.now();
    metadata.currentTokens[modelId] = (metadata.currentTokens[modelId] || 0) + tokensUsed;

    // Update performance metrics
    const modelCapability = metadata.supportedModels.find(m => m.modelId === modelId);
    if (modelCapability) {
      if (!modelCapability.performance) {
        modelCapability.performance = {
          averageLatency: latencyMs,
          successRate: 1,
        };
      } else {
        modelCapability.performance.averageLatency = 
          (modelCapability.performance.averageLatency! * 0.9) + (latencyMs * 0.1);
        modelCapability.performance.successRate = 
          (modelCapability.performance.successRate! * 0.9) + (1 * 0.1);
      }
    }

    // Reset tokens after a minute
    setTimeout(() => {
      const current = this.keyMetadata.get(keyId);
      if (current) {
        current.currentTokens[modelId] = Math.max(
          0,
          (current.currentTokens[modelId] || 0) - tokensUsed
        );
      }
    }, 60000);
  }

  public handleError(keyId: string, modelId: string, error: OpenAIError): void {
    const metadata = this.keyMetadata.get(keyId);
    if (!metadata) return;

    metadata.lastUsed = Date.now();
    metadata.errorCount++;

    // Update model-specific performance
    const modelCapability = metadata.supportedModels.find(m => m.modelId === modelId);
    if (modelCapability && modelCapability.performance) {
      modelCapability.performance.successRate = 
        (modelCapability.performance.successRate! * 0.9) + (0 * 0.1);
    }

    if (error.type === 'rate_limit') {
      metadata.rateLimitReset = Date.now() + 60000;
    }
  }
}