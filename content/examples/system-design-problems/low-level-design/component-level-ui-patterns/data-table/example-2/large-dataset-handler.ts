/**
 * Large Dataset Handler — Hybrid server pagination + client virtualization.
 *
 * Interview edge case: 100K+ rows can't be fully loaded client-side.
 * Solution: fetch pages on demand, virtualize visible rows, estimate
 * total scroll height for unloaded pages.
 */

import { useState, useCallback, useMemo, useRef } from 'react';

interface PageCache<T> {
  data: T[];
  totalCount: number;
  pageSize: number;
}

/**
 * Hook that manages large dataset loading with page caching and prefetching.
 */
export function useLargeDataset<T>(
  fetchPage: (page: number, pageSize: number) => Promise<{ data: T[]; totalCount: number }>,
  pageSize: number = 50,
  prefetchThreshold: number = 3, // Prefetch when user is within 3 pages of current page boundary
) {
  const [pageCache, setPageCache] = useState<Map<number, PageCache<T>>>(new Map());
  const [loadingPages, setLoadingPages] = useState<Set<number>>(new Set());
  const totalRowsRef = useRef<number>(0);

  const getPage = useCallback(async (rowIndex: number) => {
    const page = Math.floor(rowIndex / pageSize);
    const cached = pageCache.get(page);
    if (cached) return cached;

    if (loadingPages.has(page)) return null; // Already loading

    setLoadingPages((prev) => new Set(prev).add(page));

    try {
      const result = await fetchPage(page, pageSize);
      const cacheEntry: PageCache<T> = { ...result, pageSize };
      setPageCache((prev) => new Map(prev).set(page, cacheEntry));
      totalRowsRef.current = result.totalCount;
      return cacheEntry;
    } finally {
      setLoadingPages((prev) => {
        const next = new Set(prev);
        next.delete(page);
        return next;
      });
    }
  }, [pageCache, loadingPages, pageSize, fetchPage]);

  /**
   * Returns data for a specific row index, triggering page load if needed.
   */
  const getRow = useCallback(async (rowIndex: number): Promise<T | null> => {
    const page = Math.floor(rowIndex / pageSize);
    const cached = pageCache.get(page);
    if (cached) {
      const localIndex = rowIndex % pageSize;
      return cached.data[localIndex] ?? null;
    }
    await getPage(rowIndex);
    return null;
  }, [pageCache, pageSize, getPage]);

  /**
   * Estimated total height for scrollbar calculation (uses average row height).
   */
  const estimatedTotalRows = totalRowsRef.current || 0;

  /**
   * Prefetch adjacent pages when user scrolls near page boundaries.
   */
  const checkAndPrefetch = useCallback((currentRowIndex: number) => {
    const currentPage = Math.floor(currentRowIndex / pageSize);
    const offsetInPage = currentRowIndex % pageSize;

    // Near end of page — prefetch next
    if (offsetInPage >= pageSize - prefetchThreshold) {
      getPage((currentPage + 1) * pageSize).catch(() => {});
    }
    // Near start of page — prefetch previous
    if (offsetInPage < prefetchThreshold && currentPage > 0) {
      getPage((currentPage - 1) * pageSize).catch(() => {});
    }
  }, [pageSize, prefetchThreshold, getPage]);

  return { getRow, checkAndPrefetch, estimatedTotalRows, loadingPages };
}
