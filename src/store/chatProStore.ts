import { create } from 'zustand';
import { Message } from '../types';

interface ChatProStore {
  messages: Message[];
  selectedApiKeyId: string | null;
  addMessage: (message: Message) => void;
  setSelectedApiKeyId: (id: string | null) => void;
  clearMessages: () => void;
}

export const useChatProStore = create<ChatProStore>((set) => ({
  messages: [],
  selectedApiKeyId: null,
  addMessage: (message) => 
    set((state) => ({ messages: [...state.messages, message] })),
  setSelectedApiKeyId: (id) => 
    set({ selectedApiKeyId: id }),
  clearMessages: () => 
    set({ messages: [] }),
}));