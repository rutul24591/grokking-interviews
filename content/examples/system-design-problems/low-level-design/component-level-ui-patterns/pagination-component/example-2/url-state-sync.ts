/**
 * URL State Sync — Pagination synced to URL query params with back/forward support.
 *
 * Interview edge case: User navigates to page 5, URL shows ?page=5. User clicks
 * browser back button — URL changes to ?page=4 but the component doesn't update.
 * Solution: listen to popstate events, validate page number against total pages.
 */

import { useState, useEffect, useCallback, useRef } from 'react';

interface PaginationUrlState {
  page: number;
  pageSize: number;
}

/**
 * Hook that syncs pagination state with URL query params.
 * Handles: initial read from URL, update on change, popstate for back/forward.
 */
export function usePaginationUrlState(
  totalPages: number,
  defaultPage: number = 1,
  defaultPageSize: number = 25,
) {
  const [state, setState] = useState<PaginationUrlState>(() => {
    // Read from URL on initial load
    const params = new URLSearchParams(window.location.search);
    const page = parseInt(params.get('page') || '', 10);
    const pageSize = parseInt(params.get('pageSize') || '', 10);
    return {
      page: Number.isFinite(page) && page >= 1 && page <= totalPages ? page : defaultPage,
      pageSize: Number.isFinite(pageSize) ? pageSize : defaultPageSize,
    };
  });

  const totalPagesRef = useRef(totalPages);
  totalPagesRef.current = totalPages;

  /**
   * Updates pagination and URL.
   */
  const setPagination = useCallback((page: number, pageSize?: number) => {
    const newPage = Math.max(1, Math.min(page, totalPagesRef.current));
    const newPageSize = pageSize ?? state.pageSize;

    setState({ page: newPage, pageSize: newPageSize });

    // Update URL without full page reload
    const params = new URLSearchParams(window.location.search);
    params.set('page', String(newPage));
    if (newPageSize !== defaultPageSize) {
      params.set('pageSize', String(newPageSize));
    } else {
      params.delete('pageSize');
    }
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.pushState({ page: newPage, pageSize: newPageSize }, '', newUrl);
  }, [state.pageSize, defaultPageSize]);

  /**
   * Handles back/forward navigation.
   */
  useEffect(() => {
    const onPopState = (e: PopStateEvent) => {
      const page = e.state?.page;
      const pageSize = e.state?.pageSize;
      if (Number.isFinite(page)) {
        setState({ page, pageSize: pageSize ?? state.pageSize });
      }
    };

    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [state.pageSize]);

  return { ...state, setPagination };
}
