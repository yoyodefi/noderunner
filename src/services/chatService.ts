import { Message, ApiKey } from '../types';
import { createCompletion } from './api';
import { ApiKeyRouter } from './apiKeyRouter';
import { EncryptionService } from './encryption';
import { detectProvider } from '../utils/api-validation';

class ChatService {
  private keyRouter: ApiKeyRouter;
  private encryption: EncryptionService;
  
  constructor(apiKeys: ApiKey[]) {
    this.keyRouter = new ApiKeyRouter(apiKeys);
    this.encryption = EncryptionService.getInstance();
  }

  async sendMessage(
    messages: Message[],
    onTokenUsage: (keyId: string, tokens: number) => void
  ) {
    const apiKeys = useApiKeyStore.getState().apiKeys;
    const selectedKey = this.keyRouter.selectKey(apiKeys);

    if (!selectedKey) {
      throw new Error('No available API keys');
    }

    try {
      const decryptedKey = await this.encryption.decrypt(selectedKey.key);
      const provider = detectProvider(decryptedKey);
      
      if (!provider) {
        throw new Error('Invalid API key format');
      }

      const startTime = Date.now();
      const response = await createCompletion(decryptedKey, provider, messages);
      const latency = Date.now() - startTime;

      this.keyRouter.handleSuccess(selectedKey.id, response.usage.totalTokens);
      onTokenUsage(selectedKey.id, response.usage.totalTokens);
      
      return response;
    } catch (error: any) {
      this.keyRouter.handleError(selectedKey.id, error);
      throw error;
    }
  }
}

let chatService: ChatService | null = null;

export function initChatService(apiKeys: ApiKey[]) {
  chatService = new ChatService(apiKeys);
}

export function getChatService(): ChatService {
  if (!chatService) {
    throw new Error('Chat service not initialized');
  }
  return chatService;
}