import React from 'react';
import { Trash2 } from 'lucide-react';
import { useApiKeyStore } from '../store/apiKeyStore';
import { ApiKey } from '../types';
import { detectProvider } from '../utils/api-validation';

interface ApiKeyListProps {
  keys: ApiKey[];
}

export function ApiKeyList({ keys }: ApiKeyListProps) {
  const { removeApiKey } = useApiKeyStore();

  const getProviderColor = (provider: string) => {
    switch (provider) {
      case 'openai':
        return 'bg-green-50 text-green-700';
      case 'anthropic':
        return 'bg-purple-50 text-purple-700';
      case 'google':
        return 'bg-blue-50 text-blue-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  return (
    <div className="space-y-4">
      {keys.map((key) => {
        const provider = detectProvider(key.key) || 'unknown';
        const providerColor = getProviderColor(provider);
        
        return (
          <div key={key.id} className="p-4 border rounded-lg bg-white">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <div className="font-medium">{key.name}</div>
                <span className={`text-xs px-2 py-1 rounded-full capitalize ${providerColor}`}>
                  {provider}
                </span>
              </div>
              <button
                onClick={() => removeApiKey(key.id)}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 size={16} />
              </button>
            </div>
            <div className="text-sm text-gray-500 mb-2">
              <code>
                {key.key.substring(0, 8)}...{key.key.slice(-4)}
              </code>
            </div>
            <div className="flex justify-between text-sm">
              <span>Used: {key.usedTokens.toLocaleString()} tokens</span>
              <span>Total: {key.totalTokens.toLocaleString()} tokens</span>
            </div>
            <div className="mt-2 bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 rounded-full h-2"
                style={{
                  width: `${(key.usedTokens / key.totalTokens) * 100}%`,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}