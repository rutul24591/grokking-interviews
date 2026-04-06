// useInfiniteScroll — Hook for infinite scroll with IntersectionObserver,
// loading state, error handling, and retry logic.

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  InfiniteScrollEngine,
  type InfiniteScrollEngineState,
} from '../lib/infinite-scroll-engine';
import type { DataSource, InfiniteScrollConfig } from '../lib/virtualization-types';
import { DEFAULT_CONFIG } from '../lib/virtualization-types';

interface UseInfiniteScrollOptions<T> {
  /** Data source for fetching paginated data */
  dataSource: DataSource<T>;
  /** Configuration for infinite scroll behavior */
  config?: Partial<InfiniteScrollConfig>;
  /** Whether to auto-load the first page on mount */
  autoLoad?: boolean;
}

interface UseInfiniteScrollReturn<T> {
  /** Accumulated items loaded so far */
  items: T[];
  /** Whether a page is currently being fetched */
  isLoading: boolean;
  /** Error from the most recent fetch (null if successful) */
  error: Error | null;
  /** Whether more pages are available to load */
  hasMore: boolean;
  /** Callback for the sentinel element to trigger page loads */
  sentinelRef: (element: HTMLElement | null) => void;
  /** Manually load the next page */
  loadMore: () => void;
  /** Retry after an error */
  retry: () => void;
  /** Reset all state and re-fetch from page 1 */
  reset: () => void;
  /** Number of items loaded in the most recent page fetch */
  lastLoadedCount: number;
}

export function useInfiniteScroll<T>(
  options: UseInfiniteScrollOptions<T>,
): UseInfiniteScrollReturn<T> {
  const {
    dataSource,
    config = {},
    autoLoad = true,
  } = options;

  const mergedConfig: InfiniteScrollConfig = { ...DEFAULT_CONFIG, ...config };

  // Engine reference — recreated when data source changes
  const engineRef = useRef<InfiniteScrollEngine<T> | null>(null);

  // Local state synced from engine
  const [state, setState] = useState<InfiniteScrollEngineState<T>>({
    items: [],
    page: 0,
    isLoading: false,
    error: null,
    hasMore: true,
    retryCount: 0,
  });

  const [lastLoadedCount, setLastLoadedCount] = useState(0);

  // Sentinel element ref
  const sentinelRef = useRef<((element: HTMLElement | null) => void) | null>(null);

  // Expose the sentinel ref callback
  const sentinelRefCallback = useCallback((element: HTMLElement | null) => {
    if (sentinelRef.current) {
      sentinelRef.current(element);
    }
  }, []);

  // Initialize engine on mount or when data source changes
  useEffect(() => {
    const engine = new InfiniteScrollEngine<T>(dataSource, mergedConfig);

    // Subscribe to state changes
    const unsubscribe = engine.subscribe((newState) => {
      setState(newState);
      // Track how many items were loaded in the latest fetch
      setLastLoadedCount(newState.items.length);
    });

    engineRef.current = engine;

    // Create the sentinel observer and store the callback
    const onVisible = () => {
      engine.loadNextPage();
    };
    sentinelRef.current = engine.createObserver(onVisible);

    if (autoLoad) {
      engine.init();
    }

    return () => {
      unsubscribe();
      engine.destroy();
      engineRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataSource, mergedConfig.pageSize, mergedConfig.sentinelThreshold]);

  const loadMore = useCallback(() => {
    engineRef.current?.loadNextPage();
  }, []);

  const retry = useCallback(() => {
    engineRef.current?.retry();
  }, []);

  const reset = useCallback(() => {
    engineRef.current?.reset();
  }, []);

  return {
    items: state.items,
    isLoading: state.isLoading,
    error: state.error,
    hasMore: state.hasMore,
    sentinelRef: sentinelRefCallback,
    loadMore,
    retry,
    reset,
    lastLoadedCount,
  };
}
