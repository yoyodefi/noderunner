import React from 'react';
import { MessageSquare, Trash2 } from 'lucide-react';
import { useChatHistoryStore } from '../store/chatHistoryStore';
import { formatDate } from '../utils/date';
import { Button } from './ui/Button';

export function ChatHistory() {
  const { histories, currentChatId, setCurrentChat, deleteHistory } = useChatHistoryStore();

  if (histories.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        No chat history yet
      </div>
    );
  }

  return (
    <div className="w-64 border-l border-gray-200 overflow-y-auto">
      <div className="p-4">
        <h2 className="font-semibold text-gray-900 mb-4">Chat History</h2>
        <div className="space-y-2">
          {histories.map((history) => (
            <div
              key={history.id}
              className={`
                p-3 rounded-lg cursor-pointer transition-colors
                ${currentChatId === history.id ? 'bg-blue-50' : 'hover:bg-gray-50'}
              `}
              onClick={() => setCurrentChat(history.id)}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <MessageSquare size={16} className="text-gray-400 shrink-0" />
                  <span className="text-sm font-medium text-gray-900 truncate">
                    {history.title}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteHistory(history.id);
                  }}
                >
                  <Trash2 size={14} />
                </Button>
              </div>
              <div className="mt-1 text-xs text-gray-500">
                {formatDate(history.updatedAt)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}