'use client';
import { useRef, useCallback, useState } from 'react';
import { useChatStore } from '../lib/message-store';
import type { ChatMessage, MessageStatus } from '../lib/chat-types';

interface UseMessageSendOptions {
  chatId: string;
  userId: string;
  onSend?: (msg: ChatMessage) => void;
}

interface UseMessageSendReturn {
  send: (content: string) => void;
  isSending: boolean;
}

/**
 * Hook for sending messages with optimistic update and rollback on failure.
 *
 * Flow:
 *  1. Generate a temporary client-side ID.
 *  2. Insert the message into the store immediately (status: "sending").
 *  3. Send over WebSocket (or HTTP POST fallback).
 *  4. On acknowledgment: confirm the message (swap temp ID for server ID, status: "sent").
 *  5. On failure: remove the message from the store (rollback).
 */
export function useMessageSend({ chatId, userId, onSend }: UseMessageSendOptions): UseMessageSendReturn {
  const [isSending, setIsSending] = useState(false);
  const pendingRef = useRef<Map<string, ChatMessage>>(new Map());
  const messageIdCounter = useRef(0);

  const send = useCallback(
    (content: string) => {
      if (!content.trim()) return;

      const tempId = `temp-${userId}-${Date.now()}-${++messageIdCounter.current}`;

      const optimisticMsg: ChatMessage = {
        id: tempId,
        senderId: userId,
        type: 'text',
        content: content.trim(),
        timestamp: Date.now(),
        status: 'sending',
        reactions: {},
      };

      // ─── Optimistic insert ──────────────────────────────────────────────
      useChatStore.getState().addMessage(optimisticMsg);
      pendingRef.current.set(tempId, optimisticMsg);
      setIsSending(true);

      // Auto-scroll when at bottom
      if (useChatStore.getState().isAtBottom) {
        // The UI component will react to the new message and scroll.
        // We just flag that we want to stay at the bottom.
      }

      // ─── Network send ───────────────────────────────────────────────────
      const ws =
        typeof WebSocket !== 'undefined'
          ? null // In production, reference the shared WebSocket instance
          : null;

      if (ws && ws.readyState === 1 /* OPEN */) {
        ws.send(
          JSON.stringify({
            type: 'message',
            chatId,
            message: optimisticMsg,
          })
        );

        // Simulate server acknowledgment (replace with real WS handler)
        setTimeout(() => {
          const serverId = `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
          useChatStore.getState().confirmMessage(tempId, serverId);
          pendingRef.current.delete(tempId);
          setIsSending(false);
          onSend?.({ ...optimisticMsg, id: serverId, status: 'sent' as MessageStatus });
        }, 200);
      } else {
        // ─── HTTP fallback with rollback on failure ───────────────────────
        (async () => {
          try {
            const res = await fetch(`/api/chats/${chatId}/messages`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ content: content.trim(), senderId: userId }),
            });
            if (!res.ok) throw new Error('Send failed');

            const data = (await res.json()) as { id: string };
            useChatStore.getState().confirmMessage(tempId, data.id);
            pendingRef.current.delete(tempId);
            onSend?.({ ...optimisticMsg, id: data.id, status: 'sent' as MessageStatus });
          } catch {
            // Rollback: remove the optimistic message
            useChatStore.getState().rejectMessage(tempId);
            pendingRef.current.delete(tempId);
          } finally {
            setIsSending(false);
          }
        })();
      }
    },
    [chatId, userId, onSend]
  );

  return { send, isSending };
}
