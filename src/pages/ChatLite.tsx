import React, { useState, useEffect } from 'react';
import { Trash2, CreditCard } from 'lucide-react';
import { useApiKeyStore } from '../store/apiKeyStore';
import { useChatLiteStore } from '../store/chatLiteStore';
import { ChatMessage } from '../components/ChatMessage';
import { ChatInput } from '../components/ChatInput';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { initChatService, getChatService } from '../services/chatService';

const COST_PER_1K_TOKENS = 0.002; // $0.002 per 1K tokens

function ChatLite() {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { apiKeys, updateTokenUsage } = useApiKeyStore();
  const { 
    messages, 
    addMessage, 
    totalCost,
    totalTokens,
    updateUsage,
    clearChat 
  } = useChatLiteStore();

  useEffect(() => {
    initChatService(apiKeys);
  }, [apiKeys]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setError(null);
    const userMessage = { role: 'user' as const, content: input };
    addMessage(userMessage);
    setInput('');
    setIsLoading(true);

    try {
      const chatService = getChatService();
      const { message, usage } = await chatService.sendMessage(
        [...messages, userMessage],
        (keyId, tokens) => {
          updateTokenUsage(keyId, tokens);
          const cost = (tokens / 1000) * COST_PER_1K_TOKENS;
          updateUsage(tokens, cost);
        }
      );
      
      addMessage(message);
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
          <h1 className="text-xl font-semibold">Chat Lite</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <CreditCard size={16} className="text-gray-500" />
              <span className="font-medium">${totalCost.toFixed(4)}</span>
              <span className="text-gray-500">({totalTokens.toLocaleString()} tokens)</span>
            </div>
            
            <Button 
              variant="ghost"
              onClick={() => clearChat()}
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
          disabled={apiKeys.length === 0}
        />
      </Card>
    </div>
  );
}

export default ChatLite;