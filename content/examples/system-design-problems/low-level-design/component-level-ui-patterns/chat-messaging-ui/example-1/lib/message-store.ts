import { create } from 'zustand';
import type { ChatMessage, ChatState, ChatActions } from './chat-types';

type ChatStore = ChatState & ChatActions & {
  isAtBottom: boolean;
  setIsAtBottom: (atBottom: boolean) => void;
};

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  typingUsers: new Set(),
  hasMore: true,
  cursor: null,
  isLoading: false,
  isAtBottom: true,
  addMessage: (msg) => set((s) => ({ messages: [...s.messages, msg] })),
  confirmMessage: (tempId, serverId) => set((s) => ({
    messages: s.messages.map((m) => m.id === tempId ? { ...m, id: serverId, status: 'sent' as const } : m),
  })),
  rejectMessage: (tempId) => set((s) => ({
    messages: s.messages.filter((m) => m.id !== tempId),
  })),
  prependMessages: (msgs) => set((s) => ({ messages: [...msgs, ...s.messages] })),
  setTypingUser: (userId, isTyping) => set((s) => {
    const users = new Set(s.typingUsers);
    isTyping ? users.add(userId) : users.delete(userId);
    return { typingUsers: users };
  }),
  setHasMore: (hasMore) => set({ hasMore }),
  setCursor: (cursor) => set({ cursor }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setIsAtBottom: (isAtBottom) => set({ isAtBottom }),
}));
