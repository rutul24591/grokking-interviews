export type ChatMessageType = 'text' | 'image' | 'file' | 'system';
export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed';

export interface ChatMessage {
  id: string;
  senderId: string;
  type: ChatMessageType;
  content: string;
  timestamp: number;
  status: MessageStatus;
  mediaUrl?: string;
  reactions: Record<string, number>;
}

export interface ChatState {
  messages: ChatMessage[];
  typingUsers: Set<string>;
  hasMore: boolean;
  cursor: string | null;
  isLoading: boolean;
}

export interface ChatActions {
  addMessage: (msg: ChatMessage) => void;
  confirmMessage: (tempId: string, serverId: string) => void;
  rejectMessage: (tempId: string) => void;
  prependMessages: (msgs: ChatMessage[]) => void;
  setTypingUser: (userId: string, isTyping: boolean) => void;
  setHasMore: (hasMore: boolean) => void;
  setCursor: (cursor: string | null) => void;
  setIsLoading: (loading: boolean) => void;
}
