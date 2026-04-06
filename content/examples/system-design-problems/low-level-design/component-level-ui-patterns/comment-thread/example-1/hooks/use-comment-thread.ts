import { useCallback, useEffect, useRef, useState } from 'react';
import { useCommentStore } from '../lib/comment-store';
import {
  fetchThread,
  fetchChildren,
} from '../services/comment-api';
import type { WebSocketMessage } from '../lib/comment-types';

interface UseCommentThreadOptions {
  threadId: string;
  pageSize?: number;
  wsUrl?: string;
}

interface UseCommentThreadResult {
  isLoading: boolean;
  error: string | null;
  isConnected: boolean;
  loadMore: () => Promise<void>;
  loadChildren: (parentId: string) => Promise<void>;
}

export function useCommentThread({
  threadId,
  pageSize = 20,
  wsUrl,
}: UseCommentThreadOptions): UseCommentThreadResult {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reconnectAttempts = useRef(0);

  const setComments = useCommentStore((state) => state.setComments);
  const appendComments = useCommentStore((state) => state.appendComments);
  const addChildComments = useCommentStore((state) => state.addChildComments);
  const mergeWebSocketUpdate = useCommentStore(
    (state) => state.mergeWebSocketUpdate
  );
  const paginationCursor = useCommentStore((state) => state.paginationCursor);
  const hasMore = useCommentStore((state) => state.hasMore);

  // Initial fetch
  useEffect(() => {
    let aborted = false;

    async function fetchInitial() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetchThread(null, pageSize);
        if (!aborted) {
          setComments(response.comments, response.nextCursor, response.hasMore);
          setIsLoading(false);
        }
      } catch (err) {
        if (!aborted) {
          setError(err instanceof Error ? err.message : 'Failed to load comments');
          setIsLoading(false);
        }
      }
    }

    fetchInitial();

    return () => {
      aborted = true;
    };
  }, [threadId, pageSize, setComments]);

  // WebSocket connection
  useEffect(() => {
    if (!wsUrl) return;

    let reconnectDelay = 1000; // Start at 1s

    function connect() {
      try {
        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        ws.onopen = () => {
          setIsConnected(true);
          reconnectAttempts.current = 0;
          reconnectDelay = 1000;
        };

        ws.onmessage = (event) => {
          try {
            const message: WebSocketMessage = JSON.parse(event.data);
            mergeWebSocketUpdate(message);
          } catch {
            // Malformed message — ignore
          }
        };

        ws.onclose = () => {
          setIsConnected(false);

          // Exponential backoff: 1s, 2s, 4s, 8s, max 30s
          reconnectDelay = Math.min(reconnectDelay * 2, 30000);
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttempts.current++;
            connect();
          }, reconnectDelay);
        };

        ws.onerror = () => {
          ws.close();
        };
      } catch {
        // Connection failed — retry
        reconnectTimeoutRef.current = setTimeout(connect, reconnectDelay);
      }
    }

    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [wsUrl, mergeWebSocketUpdate]);

  // Load more (pagination)
  const loadMore = useCallback(async () => {
    if (!hasMore || !paginationCursor) return;

    try {
      const response = await fetchThread(paginationCursor, pageSize);
      appendComments(response.comments, response.nextCursor, response.hasMore);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load more comments');
    }
  }, [hasMore, paginationCursor, pageSize, appendComments]);

  // Load children (lazy loading)
  const loadChildren = useCallback(
    async (parentId: string) => {
      try {
        const response = await fetchChildren(parentId);
        addChildComments(parentId, response.comments);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load replies');
      }
    },
    [addChildComments]
  );

  return { isLoading, error, isConnected, loadMore, loadChildren };
}
