/**
 * Pagination — Staff-Level URL State Management with Deep Linking.
 *
 * Staff differentiator: Full URL state synchronization with back/forward
 * support, shareable deep links to specific pages, and stale URL recovery
 * when the page number exceeds total pages.
 */

import { useState, useEffect, useCallback } from 'react';

/**
 * Hook that provides full URL-based pagination state with browser history integration.
 */
export function useDeepLinkPagination(
  totalPages: number,
  defaultPage: number = 1,
  defaultPageSize: number = 25,
  urlParam: string = 'page',
) {
  const [state, setState] = useState(() => {
    if (typeof window === 'undefined') return { page: defaultPage, pageSize: defaultPageSize };

    const params = new URLSearchParams(window.location.search);
    const page = parseInt(params.get(urlParam) || '', 10);
    const pageSize = parseInt(params.get('pageSize') || '', 10);

    // Validate and clamp
    const validPage = Number.isFinite(page) && page >= 1 ? Math.min(page, totalPages) : defaultPage;
    const validPageSize = Number.isFinite(pageSize) ? pageSize : defaultPageSize;

    return { page: validPage, pageSize: validPageSize };
  });

  /**
   * Updates page and URL simultaneously.
   */
  const setPage = useCallback((page: number) => {
    const validPage = Math.max(1, Math.min(page, totalPages));
    setState((prev) => {
      const newState = { ...prev, page: validPage };

      // Update URL
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        params.set(urlParam, String(validPage));
        if (prev.pageSize !== defaultPageSize) {
          params.set('pageSize', String(prev.pageSize));
        }
        const url = `${window.location.pathname}?${params.toString()}`;
        window.history.pushState(newState, '', url);
      }

      return newState;
    });
  }, [totalPages, defaultPageSize, urlParam]);

  /**
   * Handles browser back/forward navigation.
   */
  useEffect(() => {
    const onPopState = (e: PopStateEvent) => {
      if (e.state?.page) {
        setState({ page: e.state.page, pageSize: e.state.pageSize || defaultPageSize });
      }
    };

    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [defaultPageSize]);

  /**
   * Recovers from stale URLs (page number exceeds current total).
   */
  useEffect(() => {
    if (state.page > totalPages) {
      setPage(totalPages);
    }
  }, [state.page, totalPages, setPage]);

  return { ...state, setPage };
}
