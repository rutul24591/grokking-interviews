/**
 * Chat/Messaging — Edge Case: Optimistic Message Rollback on Send Failure.
 *
 * When a message fails to send, show the error inline, preserve the content for retry,
 * and allow the user to retry or discard.
 */

export interface OptimisticMessage {
  tempId: string;
  content: string;
  status: 'sending' | 'sent' | 'failed';
  error?: string;
  timestamp: number;
  retryCount: number;
}

export function handleOptimisticSend(
  messages: OptimisticMessage[],
  tempId: string,
  sendFn: (content: string) => Promise<{ serverId: string }>,
  maxRetries: number = 3,
): Promise<{ messages: OptimisticMessage[]; error?: string }> {
  const msgIndex = messages.findIndex((m) => m.tempId === tempId);
  if (msgIndex === -1) return Promise.resolve({ messages, error: 'Message not found' });

  const msg = messages[msgIndex];

  return sendFn(msg.content)
    .then(({ serverId }) => {
      // Success: replace temp ID with server ID
      const updated = [...messages];
      updated[msgIndex] = { ...msg, status: 'sent' as const };
      return { messages: updated };
    })
    .catch((err) => {
      const retryCount = msg.retryCount + 1;
      const updated = [...messages];

      if (retryCount >= maxRetries) {
        // Max retries reached — mark as failed
        updated[msgIndex] = {
          ...msg,
          status: 'failed' as const,
          error: err.message || 'Failed to send',
          retryCount,
        };
      } else {
        // Still retrying — keep as sending
        updated[msgIndex] = { ...msg, status: 'sending' as const, retryCount };
        // Auto-retry after delay
        setTimeout(() => {
          handleOptimisticSend(updated, tempId, sendFn, maxRetries);
        }, Math.min(1000 * Math.pow(2, retryCount), 10000));
      }

      return { messages: updated, error: err.message };
    });
}

/**
 * Retries a failed message.
 */
export function retryFailedMessage(
  messages: OptimisticMessage[],
  tempId: string,
  sendFn: (content: string) => Promise<{ serverId: string }>,
  maxRetries: number = 3,
): Promise<{ messages: OptimisticMessage[] }> {
  const msgIndex = messages.findIndex((m) => m.tempId === tempId);
  if (msgIndex === -1) return Promise.resolve({ messages });

  const updated = [...messages];
  updated[msgIndex] = { ...messages[msgIndex], status: 'sending' as const, retryCount: 0, error: undefined };

  return handleOptimisticSend(updated, tempId, sendFn, maxRetries);
}
