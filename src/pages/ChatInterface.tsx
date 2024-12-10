import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { useApiKeyStore } from '../store/apiKeyStore';
import { useChatProStore } from '../store/chatProStore';
import { createChatCompletion } from '../services/openai';
import { ChatMessage } from '../components/ChatMessage';
import { ChatInput } from '../components/ChatInput';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';

function ChatInterface() {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { apiKeys, updateTokenUsage } = useApiKeyStore();
  const { 
    messages, 
    addMessage, 
    selectedApiKeyId, 
    setSelectedApiKeyId, 
    clearMessages 
  } = useChatProStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !selectedApiKeyId) return;

    const selectedKey = apiKeys.find(key => key.id === selectedApiKeyId);
    if (!selectedKey) return;

    setError(null);
    const userMessage = { role: 'user' as const, content: input };
    addMessage(userMessage);
    setInput('');
    setIsLoading(true);

    try {
      const { message, usage } = await createChatCompletion(
        selectedKey.key,
        [...messages, userMessage]
      );
      
      addMessage(message);
      updateTokenUsage(selectedApiKeyId, usage.totalTokens);
    } catch (err: any) {
      setError(err.message || 'An error occurred while processing your request');
      addMessage({
        role: 'assistant',
        content: 'Sorry, there was an error processing your request. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4">
      <Card className="h-[calc(100vh-8rem)]">
        <Card.Header>
          <h1 className="text-xl font-semibold">AI Chat Pro</h1>
          <div className="flex items-center gap-4">
            <Select
              value={selectedApiKeyId || ''}
              onChange={(e) => setSelectedApiKeyId(e.target.value || null)}
            >
              <option value="">Select API Key</option>
              {apiKeys.map((key) => (
                <option key={key.id} value={key.id}>
                  {key.name}
                </option>
              ))}
            </Select>
            <Button 
              variant="ghost"
              onClick={() => clearMessages()}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 size={16} className="mr-2" />
              Clear
            </Button>
          </div>
        </Card.Header>

        <div className="flex-1 overflow-y-auto space-y-6 p-4">
          {messages.map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))}
          
          {isLoading && (
            <div className="flex justify-start px-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="animate-pulse">Thinking...</div>
              </div>
            </div>
          )}
          
          {error && (
            <div className="flex justify-center px-4">
              <div className="bg-red-50 text-red-600 rounded-lg p-3 text-sm">
                {error}
              </div>
            </div>
          )}
        </div>

        <ChatInput
          input={input}
          setInput={setInput}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          disabled={!selectedApiKeyId}
        />
      </Card>
    </div>
  );
}

export default ChatInterface;