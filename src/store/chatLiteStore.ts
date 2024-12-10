import { create } from 'zustand';
import { Message } from '../types';

interface ChatLiteStore {
  messages: Message[];
  totalCost: number;
  totalTokens: number;
  addMessage: (message: Message) => void;
  updateUsage: (tokens: number, cost: number) => void;
  clearChat: () => void;
}

export const useChatLiteStore = create<ChatLiteStore>((set) => ({
  messages: [],
  totalCost: 0,
  totalTokens: 0,
  addMessage: (message) => 
    set((state) => ({ messages: [...state.messages, message] })),
  updateUsage: (tokens, cost) =>
    set((state) => ({ 
      totalTokens: state.totalTokens + tokens,
      totalCost: state.totalCost + cost,
    })),
  clearChat: () => 
    set({ messages: [], totalCost: 0, totalTokens: 0 }),
}));