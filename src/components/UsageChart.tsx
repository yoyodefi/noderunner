import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useApiKeyStore } from '../store/apiKeyStore';
import { detectProvider } from '../utils/api-validation';

export function UsageChart() {
  const { apiKeys } = useApiKeyStore();

  // Group usage data by provider
  const usageByProvider = apiKeys.reduce((acc, key) => {
    const provider = detectProvider(key.key) || 'unknown';
    if (!acc[provider]) {
      acc[provider] = {
        used: 0,
        total: 0,
      };
    }
    acc[provider].used += key.usedTokens;
    acc[provider].total += key.totalTokens;
    return acc;
  }, {} as Record<string, { used: number; total: number }>);

  const data = Object.entries(usageByProvider).map(([provider, usage]) => ({
    name: provider,
    used: usage.used,
    remaining: usage.total - usage.used,
  }));

  const colors = {
    openai: '#10B981',
    anthropic: '#8B5CF6',
    google: '#3B82F6',
    unknown: '#6B7280',
  };

  return (
    <LineChart width={500} height={300} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line 
        type="monotone" 
        dataKey="used" 
        name="Used Tokens"
        stroke="#8884d8"
      />
      <Line 
        type="monotone" 
        dataKey="remaining" 
        name="Remaining Tokens"
        stroke="#82ca9d"
      />
    </LineChart>
  );
}