import React, { useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { cn } from '../utils/cn';

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  disabled: boolean;
}

export function ChatInput({ input, setInput, onSubmit, isLoading, disabled }: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit(e);
    }
  };

  return (
    <form onSubmit={onSubmit} className="relative flex items-end gap-2 p-4 border-t">
      <textarea
        ref={textareaRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your message..."
        disabled={disabled || isLoading}
        className={cn(
          "flex-1 max-h-36 resize-none rounded-lg border p-3 focus:outline-none focus:ring-2 focus:ring-blue-500",
          "disabled:opacity-50 disabled:bg-gray-100",
          "scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
        )}
        rows={1}
      />
      <button
        type="submit"
        disabled={disabled || isLoading || !input.trim()}
        className={cn(
          "flex items-center gap-2 rounded-lg px-4 py-2 font-medium text-white",
          "bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400",
          "transition-colors duration-200"
        )}
      >
        <Send size={20} />
        Send
      </button>
    </form>
  );
}