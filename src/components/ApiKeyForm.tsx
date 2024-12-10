import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Key } from 'lucide-react';
import { API_KEY_PATTERNS } from '../utils/api-validation';

const apiKeySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  key: z
    .string()
    .refine(
      (key) => Object.values(API_KEY_PATTERNS).some(pattern => pattern.test(key)),
      'Invalid API key format. Please check your API key.'
    ),
  totalTokens: z.number().min(1, 'Total tokens must be greater than 0'),
});

type ApiKeyFormData = z.infer<typeof apiKeySchema>;

interface ApiKeyFormProps {
  onSubmit: (data: ApiKeyFormData) => void;
  onCancel: () => void;
}

export function ApiKeyForm({ onSubmit, onCancel }: ApiKeyFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<ApiKeyFormData>({
    resolver: zodResolver(apiKeySchema),
    defaultValues: {
      totalTokens: 1000000
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          {...register('name')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="My API Key"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">API Key</label>
        <div className="mt-1 relative">
          <input
            {...register('key')}
            type="password"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter your API key..."
          />
        </div>
        {errors.key && (
          <p className="mt-1 text-sm text-red-600">{errors.key.message}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          Supported formats:
          <br />
          - OpenAI: Starts with sk- (51 chars)
          <br />
          - Anthropic: Starts with anthropic- (58 chars)
          <br />
          - Google: Starts with AIza (39 chars)
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Total Tokens</label>
        <input
          {...register('totalTokens', { valueAsNumber: true })}
          type="number"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="1000000"
        />
        {errors.totalTokens && (
          <p className="mt-1 text-sm text-red-600">{errors.totalTokens.message}</p>
        )}
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          <Key size={16} />
          Add Key
        </button>
      </div>
    </form>
  );
}