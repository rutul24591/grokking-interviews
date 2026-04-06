/**
 * Multi-Select Tag Input — Staff-Level Performance Optimization.
 *
 * Staff differentiator: Virtualized dropdown for large suggestion sets,
 * debounced async fetch with request cancellation, and memoized tag rendering
 * to prevent re-renders when unrelated tags change.
 */

import { useRef, useCallback, useState, useEffect } from 'react';

/**
 * Virtualized dropdown for large suggestion lists.
 * Only renders visible items + overscan buffer.
 */
export function useVirtualizedDropdown(
  itemCount: number,
  itemHeight: number = 36,
  containerHeight: number = 240,
  overscan: number = 3,
) {
  const [scrollTop, setScrollTop] = useState(0);

  const visibleStart = Math.floor(scrollTop / itemHeight);
  const visibleCount = Math.ceil(containerHeight / itemHeight);

  const getVisibleRange = useCallback(() => {
    const start = Math.max(0, visibleStart - overscan);
    const end = Math.min(itemCount, visibleStart + visibleCount + overscan);
    return { start, end };
  }, [visibleStart, visibleCount, itemCount, overscan]);

  const totalHeight = itemCount * itemHeight;

  return { scrollTop, setScrollTop, getVisibleRange, totalHeight };
}

/**
 * Debounced async fetch with request cancellation.
 * Cancels in-flight requests when a new query is typed before the previous one completes.
 */
export function useCancelableFetch<T>(
  fetchFn: (query: string, signal: AbortSignal) => Promise<T>,
  debounceMs: number = 200,
) {
  const abortControllerRef = useRef<AbortController | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [result, setResult] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const execute = useCallback((query: string) => {
    // Cancel previous request
    if (abortControllerRef.current) abortControllerRef.current.abort();
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      const controller = new AbortController();
      abortControllerRef.current = controller;
      setIsLoading(true);

      fetchFn(query, controller.signal)
        .then((data) => {
          if (!controller.signal.aborted) {
            setResult(data);
            setIsLoading(false);
          }
        })
        .catch((err) => {
          if (err.name !== 'AbortError') {
            console.error('Fetch error:', err);
            setIsLoading(false);
          }
        });
    }, debounceMs);
  }, [fetchFn, debounceMs]);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) abortControllerRef.current.abort();
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return { result, isLoading, execute };
}
