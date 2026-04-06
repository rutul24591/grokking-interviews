/**
 * Stale Response Guard — Discards out-of-order API responses.
 *
 * Interview edge case: User types "reac" (request A), then types "react" (request B).
 * If request B returns before request A (network variability), we must discard A's
 * results to avoid showing stale suggestions.
 *
 * Two-layer defense:
 * 1. AbortController — cancels in-flight request when query changes
 * 2. Request ID — monotonically increasing counter, response is discarded if its ID
 *    doesn't match the current request ID
 */

import { useRef, useCallback, useState, useEffect } from 'react';

interface FetchResult<T> {
  data: T[];
  requestId: number;
}

/**
 * Hook that wraps async fetch with AbortController + request ID guard.
 */
export function useStaleGuardedFetch<T>(
  fetchFn: (query: string, signal: AbortSignal) => Promise<T[]>,
) {
  const currentRequestIdRef = useRef(0);
  const abortControllerRef = useRef<AbortController | null>(null);
  const [result, setResult] = useState<FetchResult<T> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (query: string) => {
    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Increment request ID
    const requestId = ++currentRequestIdRef.current;
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchFn(query, controller.signal);

      // Guard: discard if this is no longer the current request
      if (requestId !== currentRequestIdRef.current) {
        return; // Stale response, discard silently
      }

      setResult({ data, requestId });
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        return; // Request was cancelled, not an error
      }

      // Guard: discard error from stale request
      if (requestId !== currentRequestIdRef.current) return;

      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      // Only set loading to false if this is still the current request
      if (requestId === currentRequestIdRef.current) {
        setIsLoading(false);
      }
    }
  }, [fetchFn]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return { result, isLoading, error, execute };
}
