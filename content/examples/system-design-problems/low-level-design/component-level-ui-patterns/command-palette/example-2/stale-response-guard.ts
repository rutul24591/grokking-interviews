/**
 * Command Palette — Edge Case: Rapid Query Changes with Stale Response Guard.
 *
 * When the user types quickly, multiple async searches are triggered.
 * Responses may arrive out of order. Discard stale responses using
 * a monotonically increasing request ID.
 */

import { useRef, useCallback, useState } from 'react';

export function useStaleGuardedSearch<T>(
  searchFn: (query: string, signal: AbortSignal) => Promise<T[]>,
  debounceMs: number = 150,
) {
  const [results, setResults] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const requestIdRef = useRef(0);
  const abortControllerRef = useRef<AbortController | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const search = useCallback((query: string) => {
    // Cancel previous debounce timer
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      // Cancel previous in-flight request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Increment request ID
      const currentRequestId = ++requestIdRef.current;
      const controller = new AbortController();
      abortControllerRef.current = controller;

      setIsLoading(true);

      try {
        const data = await searchFn(query, controller.signal);

        // Guard: discard if this is no longer the current request
        if (currentRequestId !== requestIdRef.current) return;

        setResults(data);
      } catch (err) {
        // Ignore abort errors
        if (err instanceof DOMException && err.name === 'AbortError') return;

        // Guard: discard error from stale request
        if (currentRequestId !== requestIdRef.current) return;

        console.error('Search error:', err);
      } finally {
        if (currentRequestId === requestIdRef.current) {
          setIsLoading(false);
        }
      }
    }, debounceMs);
  }, [searchFn, debounceMs]);

  return { results, isLoading, search };
}
