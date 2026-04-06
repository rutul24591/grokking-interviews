'use client';
import { useState, useCallback, useEffect, useRef } from 'react';
import type { Notification } from '../lib/notification-types';

interface UseNotificationsOptions {
  pollingIntervalMs?: number;
  fetchFn?: () => Promise<Notification[]>;
  markReadFn?: (ids: string[]) => Promise<void>;
  wsUrl?: string;
}

interface UseNotificationsReturn {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  connected: boolean;
  deliveryMethod: 'websocket' | 'polling';
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  dismiss: (id: string) => void;
  dismissAll: () => void;
  refetch: () => Promise<void>;
}

export function useNotifications({
  pollingIntervalMs = 30_000,
  fetchFn,
  markReadFn,
  wsUrl,
}: UseNotificationsOptions = {}): UseNotificationsReturn {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState<'websocket' | 'polling'>('polling');

  const wsRef = useRef<WebSocket | null>(null);
  const pollingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isMountedRef = useRef(true);
  const notificationIdsRef = useRef(new Set<string>());

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Default fetch stub
  const defaultFetch = async (): Promise<Notification[]> => {
    return notifications; // In production, fetch from API
  };

  const doFetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await (fetchFn ?? defaultFetch)();
      if (!isMountedRef.current) return;
      setNotifications((prev) => {
        // Merge new with existing, deduplicate by id
        const existingIds = new Set(prev.map((n) => n.id));
        const merged = [...prev];
        for (const n of data) {
          if (!existingIds.has(n.id)) {
            merged.unshift(n);
            existingIds.add(n.id);
          }
        }
        // Keep last 200
        return merged.slice(0, 200);
      });
    } catch (err) {
      if (!isMountedRef.current) return;
      setError(err instanceof Error ? err.message : 'Failed to fetch notifications');
    } finally {
      if (isMountedRef.current) setLoading(false);
    }
  }, [fetchFn, notifications]);

  const markAsRead = useCallback(
    async (id: string) => {
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
      try {
        await markReadFn?.([id]);
      } catch {
        // Revert on failure
        setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: false } : n)));
      }
    },
    [markReadFn]
  );

  const markAllAsRead = useCallback(async () => {
    const unreadIds = notifications.filter((n) => !n.read).map((n) => n.id);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    try {
      await markReadFn?.(unreadIds);
    } catch {
      setNotifications((prev) => prev.map((n) => ({ ...n, read: notificationIdsRef.current.has(n.id) ? n.read : false })));
    }
  }, [notifications, markReadFn]);

  const dismiss = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const dismissAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const refetch = useCallback(async () => {
    await doFetch();
  }, [doFetch]);

  // WebSocket connection
  useEffect(() => {
    if (!wsUrl) return;

    const connect = () => {
      try {
        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        ws.onopen = () => {
          setConnected(true);
          setDeliveryMethod('websocket');
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data) as Notification | Notification[];
            const items = Array.isArray(data) ? data : [data];
            setNotifications((prev) => {
              const existingIds = new Set(prev.map((n) => n.id));
              const newItems = items.filter((n) => !existingIds.has(n.id));
              return [...newItems, ...prev].slice(0, 200);
            });
            items.forEach((n) => notificationIdsRef.current.add(n.id));
          } catch {
            // Ignore malformed messages
          }
        };

        ws.onclose = () => {
          setConnected(false);
          // Reconnect after delay
          setTimeout(connect, 3000);
        };

        ws.onerror = () => {
          setConnected(false);
        };
      } catch {
        setDeliveryMethod('polling');
      }
    };

    connect();

    return () => {
      wsRef.current?.close();
      wsRef.current = null;
    };
  }, [wsUrl]);

  // Polling fallback
  useEffect(() => {
    if (connected) return; // Don't poll if WebSocket is connected

    pollingTimerRef.current = setInterval(doFetch, pollingIntervalMs);

    return () => {
      if (pollingTimerRef.current) clearInterval(pollingTimerRef.current);
    };
  }, [connected, doFetch, pollingIntervalMs]);

  // Initial fetch
  useEffect(() => {
    doFetch();
  }, [doFetch]);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    connected,
    deliveryMethod,
    markAsRead,
    markAllAsRead,
    dismiss,
    dismissAll,
    refetch,
  };
}
