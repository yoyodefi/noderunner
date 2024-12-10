import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { ApiKeyForm } from './ApiKeyForm';
import { ApiKeyList } from './ApiKeyList';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { useApiKeyStore } from '../store/apiKeyStore';
import { detectProvider } from '../utils/api-validation';

export function ApiKeyManager() {
  const [showAddKey, setShowAddKey] = useState(false);
  const { apiKeys, addApiKey } = useApiKeyStore();

  const handleAddKey = async (data: any) => {
    const provider = detectProvider(data.key);
    if (!provider) {
      throw new Error('Invalid API key format');
    }

    await addApiKey({
      ...data,
      provider,
      usedTokens: 0,
    });
    setShowAddKey(false);
  };

  // Group keys by provider
  const keysByProvider = apiKeys.reduce((acc, key) => {
    const provider = detectProvider(key.key) || 'unknown';
    if (!acc[provider]) {
      acc[provider] = [];
    }
    acc[provider].push(key);
    return acc;
  }, {} as Record<string, typeof apiKeys>);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">API Keys</h2>
        <Button 
          onClick={() => setShowAddKey(true)}
          size="sm"
        >
          <Plus size={16} className="mr-2" />
          Add Key
        </Button>
      </div>

      {showAddKey ? (
        <Card className="p-4">
          <ApiKeyForm 
            onSubmit={handleAddKey}
            onCancel={() => setShowAddKey(false)}
          />
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(keysByProvider).map(([provider, keys]) => (
            <div key={provider} className="space-y-2">
              <h3 className="text-sm font-medium capitalize">{provider} Keys</h3>
              <ApiKeyList keys={keys} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}