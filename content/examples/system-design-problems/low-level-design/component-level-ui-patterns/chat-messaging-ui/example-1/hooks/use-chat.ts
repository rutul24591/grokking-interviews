'use client';
import { useRef, useEffect, useCallback, useState } from 'react';
import { useChatStore } from '../lib/message-store';
import type { ChatMessage } from '../lib/chat-types';

interface UseChatOptions {
  chatId: string;
  userId: string;
  wsUrl?: string;
  pageSize?: number;
}

interface UseChatReturn {
  messages: ChatMessage[];
  isAtBottom: boolean;
  typingUsers: string[];
  isLoading: boolean;
  hasMore: boolean;
  loadMore: () => Promise<void>;
  scrollToBottom: () => void;
  reconnect: () => void;
}

/**
 * Main orchestrator hook for the chat experience.
 * Manages WebSocket lifecycle, pagination, scroll position, and typing indicators.
 */
export function useChat({ chatId, userId, wsUrl, pageSize = 30 }: UseChatOptions): UseChatReturn {
  const messages = useChatStore((s) => s.messages);
  const isAtBottom = useChatStore((s) => s.isAtBottom);
  const typingUsers = useChatStore((s) => Array.from(s.typingUsers));
  const isLoading = useChatStore((s) => s.isLoading);
  const hasMore = useChatStore((s) => s.hasMore);
  const setIsAtBottom = useChatStore((s) => s.setIsAtBottom);
  const setIsLoading = useChatStore((s) => s.setIsLoading);
  const setHasMore = useChatStore((s) => s.setHasMore);
  const setCursor = useChatStore((s) => s.setCursor);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reconnectAttempts = useRef(0);
  const [wsReady, setWsReady] = useState(false);

  // ─── WebSocket connection with exponential backoff ──────────────────────
  const connect = useCallback(() => {
    if (!wsUrl) return;
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setWsReady(true);
        reconnectAttempts.current = 0;
        // Join the chat room
        ws.send(JSON.stringify({ type: 'join', chatId, userId }));
      };

      ws.onclose = () => {
        setWsReady(false);
        // Exponential backoff: 1s, 2s, 4s, 8s, max 30s
        const delay = Math.min(1000 * 2 ** reconnectAttempts.current, 30000);
        reconnectAttempts.current += 1;
        reconnectTimerRef.current = setTimeout(connect, delay);
      };

      ws.onerror = () => {
        ws.close();
      };
    } catch {
      // Connection failed, will retry on next reconnect cycle
      setWsReady(false);
    }
  }, [wsUrl, chatId, userId]);

  const reconnect = useCallback(() => {
    reconnectAttempts.current = 0;
    wsRef.current?.close();
    connect();
  }, [connect]);

  // ─── Cleanup on unmount ─────────────────────────────────────────────────
  useEffect(() => {
    connect();
    return () => {
      if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
      wsRef.current?.close();
    };
  }, [connect]);

  // ─── Scroll to bottom helper ────────────────────────────────────────────
  const scrollToBottom = useCallback(() => {
    // The message list component reads `isAtBottom` from the store;
    // setting it here signals the list to auto-scroll.
    setIsAtBottom(true);
  }, [setIsAtBottom]);

  // ─── Load more (pagination) ─────────────────────────────────────────────
  const loadMore = useCallback(async () => {
    if (!hasMore || isLoading) return;
    setIsLoading(true);
    try {
      // In production this would be a real API call.
      // Simulating a paginated fetch that prepends older messages.
      const cursor = useChatStore.getState().cursor;
      const res = await fetch(
        `/api/chats/${chatId}/messages?cursor=${cursor ?? ''}&limit=${pageSize}`
      );
      if (!res.ok) throw new Error('Failed to load messages');
      const data = (await res.json()) as { messages: ChatMessage[]; nextCursor: string | null };
      useChatStore.getState().prependMessages(data.messages);
      setCursor(data.nextCursor);
      setHasMore(data.nextCursor !== null);
    } finally {
      setIsLoading(false);
    }
  }, [chatId, pageSize, hasMore, isLoading, setIsLoading, setCursor, setHasMore]);

  return {
    messages,
    isAtBottom,
    typingUsers,
    isLoading,
    hasMore,
    loadMore,
    scrollToBottom,
    reconnect,
  };
}
