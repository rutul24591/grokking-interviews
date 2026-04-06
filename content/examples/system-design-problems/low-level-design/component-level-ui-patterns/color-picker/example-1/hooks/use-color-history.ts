'use client';
import { useState, useCallback, useRef, useEffect } from 'react';

const STORAGE_KEY = 'color-picker-history';
const MAX_HISTORY = 20;

interface UseColorHistoryOptions {
  maxSize?: number;
  storageKey?: string;
}

interface UseColorHistoryReturn {
  history: string[];
  addColor: (color: string) => void;
  removeColor: (color: string) => void;
  clearHistory: () => void;
  hasColor: (color: string) => boolean;
}

/**
 * LRU-eviction color history with localStorage persistence.
 * Most recently used colors bubble to the front; oldest colors
 * are evicted when the list exceeds maxSize.
 */
export function useColorHistory({
  maxSize = MAX_HISTORY,
  storageKey = STORAGE_KEY,
}: UseColorHistoryOptions = {}): UseColorHistoryReturn {
  const [history, setHistory] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored) as string[];
        if (Array.isArray(parsed)) return parsed.slice(0, maxSize);
      }
    } catch {
      // Ignore malformed storage data
    }
    return [];
  });

  const historyRef = useRef(history);
  useEffect(() => {
    historyRef.current = history;
  }, [history]);

  // Persist to localStorage whenever history changes
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(history));
    } catch {
      // Storage quota exceeded or unavailable
    }
  }, [history, storageKey]);

  /**
   * Add a color to history. If already present, move it to the front (MRU position).
   * If the list exceeds maxSize, the least recently used color (last item) is evicted.
   */
  const addColor = useCallback(
    (color: string) => {
      setHistory((prev) => {
        const normalized = color.toLowerCase().trim();
        const existingIndex = prev.findIndex((c) => c.toLowerCase().trim() === normalized);
        let next: string[];

        if (existingIndex >= 0) {
          // Move existing to front (MRU)
          next = [prev[existingIndex], ...prev.slice(0, existingIndex), ...prev.slice(existingIndex + 1)];
        } else {
          // Add new color to front
          next = [normalized, ...prev];
        }

        // LRU eviction: trim to maxSize
        return next.slice(0, maxSize);
      });
    },
    [maxSize]
  );

  const removeColor = useCallback((color: string) => {
    const normalized = color.toLowerCase().trim();
    setHistory((prev) => prev.filter((c) => c.toLowerCase().trim() !== normalized));
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    try {
      localStorage.removeItem(storageKey);
    } catch {
      // Ignore
    }
  }, [storageKey]);

  const hasColor = useCallback(
    (color: string) => {
      const normalized = color.toLowerCase().trim();
      return historyRef.current.some((c) => c.toLowerCase().trim() === normalized);
    },
    []
  );

  return {
    history,
    addColor,
    removeColor,
    clearHistory,
    hasColor,
  };
}
