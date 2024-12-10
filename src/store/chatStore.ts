import { create } from 'zustand';
import { Message } from '../types';

interface ChatStore {
  messages: Message[];
  selectedApiKeyId: string | null;
  addMessage: (message: Message) => void;
  setSelectedApiKeyId: (id: string | null) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  selectedApiKeyId: null,
  addMessage: (message) => 
    set((state) => ({ messages: [...state.messages, message] })),
  setSelectedApiKeyId: (id) => 
    set({ selectedApiKeyId: id }),
  clearMessages: () => 
    set({ messages: [] }),
}));