import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Message } from '../types';

interface ChatHistory {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

interface ChatHistoryStore {
  histories: ChatHistory[];
  currentChatId: string | null;
  addHistory: (messages: Message[]) => void;
  updateHistory: (id: string, messages: Message[]) => void;
  deleteHistory: (id: string) => void;
  setCurrentChat: (id: string | null) => void;
  getCurrentChat: () => ChatHistory | null;
}

export const useChatHistoryStore = create<ChatHistoryStore>()(
  persist(
    (set, get) => ({
      histories: [],
      currentChatId: null,

      addHistory: (messages) => set((state) => {
        const id = crypto.randomUUID();
        const title = messages[0]?.content.slice(0, 30) + '...' || 'New Chat';
        const now = new Date();
        
        const newHistory = {
          id,
          title,
          messages,
          createdAt: now,
          updatedAt: now,
        };

        return {
          histories: [newHistory, ...state.histories],
          currentChatId: id,
        };
      }),

      updateHistory: (id, messages) => set((state) => ({
        histories: state.histories.map((history) =>
          history.id === id
            ? { ...history, messages, updatedAt: new Date() }
            : history
        ),
      })),

      deleteHistory: (id) => set((state) => ({
        histories: state.histories.filter((history) => history.id !== id),
        currentChatId: state.currentChatId === id ? null : state.currentChatId,
      })),

      setCurrentChat: (id) => set({ currentChatId: id }),

      getCurrentChat: () => {
        const { histories, currentChatId } = get();
        return histories.find((history) => history.id === currentChatId) || null;
      },
    }),
    {
      name: 'chat-history',
    }
  )
);