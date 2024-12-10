import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { EncryptionService } from '../services/encryption';

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  totalTokens: number;
  usedTokens: number;
  createdAt: Date;
}

interface ApiKeyStore {
  apiKeys: ApiKey[];
  addApiKey: (key: Omit<ApiKey, 'id' | 'createdAt'>) => Promise<void>;
  removeApiKey: (id: string) => void;
  updateTokenUsage: (id: string, usage: number) => void;
}

// Custom storage that encrypts/decrypts API keys
const encryptedStorage = {
  getItem: async (name: string): Promise<string | null> => {
    const value = localStorage.getItem(name);
    if (!value) return null;

    try {
      const data = JSON.parse(value);
      if (data.state && data.state.apiKeys) {
        const encryption = EncryptionService.getInstance();
        const decryptedKeys = await Promise.all(
          data.state.apiKeys.map(async (key: ApiKey) => ({
            ...key,
            key: await encryption.decrypt(key.key),
          }))
        );
        return JSON.stringify({
          ...data,
          state: { ...data.state, apiKeys: decryptedKeys },
        });
      }
      return value;
    } catch (error) {
      console.error('Error decrypting API keys:', error);
      return null;
    }
  },

  setItem: async (name: string, value: string): Promise<void> => {
    try {
      const data = JSON.parse(value);
      if (data.state && data.state.apiKeys) {
        const encryption = EncryptionService.getInstance();
        const encryptedKeys = await Promise.all(
          data.state.apiKeys.map(async (key: ApiKey) => ({
            ...key,
            key: await encryption.encrypt(key.key),
          }))
        );
        localStorage.setItem(
          name,
          JSON.stringify({
            ...data,
            state: { ...data.state, apiKeys: encryptedKeys },
          })
        );
      } else {
        localStorage.setItem(name, value);
      }
    } catch (error) {
      console.error('Error encrypting API keys:', error);
    }
  },

  removeItem: (name: string): void => {
    localStorage.removeItem(name);
  },
};

export const useApiKeyStore = create<ApiKeyStore>()(
  persist(
    (set) => ({
      apiKeys: [],
      
      addApiKey: async (key) => {
        const encryption = EncryptionService.getInstance();
        const encryptedKey = await encryption.encrypt(key.key);
        
        set((state) => ({
          apiKeys: [
            ...state.apiKeys,
            {
              ...key,
              id: crypto.randomUUID(),
              key: encryptedKey,
              createdAt: new Date(),
            },
          ],
        }));
      },

      removeApiKey: (id) =>
        set((state) => ({
          apiKeys: state.apiKeys.filter((key) => key.id !== id),
        })),

      updateTokenUsage: (id, usage) =>
        set((state) => ({
          apiKeys: state.apiKeys.map((key) =>
            key.id === id
              ? { ...key, usedTokens: key.usedTokens + usage }
              : key
          ),
        })),
    }),
    {
      name: 'api-keys',
      storage: createJSONStorage(() => encryptedStorage),
      partialize: (state) => ({ apiKeys: state.apiKeys }),
    }
  )
);