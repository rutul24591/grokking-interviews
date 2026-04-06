import { useMemo, useCallback } from 'react';
import type { RowData } from '../lib/table-types';
import type { UseStoreApi } from 'zustand';

interface PaginationResult<T extends RowData> {
  totalPages: number;
  startIndex: number;
  endIndex: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  paginatedRows: T[];
  nextPage: () => void;
  prevPage: () => void;
  goToPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
}

/**
 * Custom hook for pagination logic.
 * Computes derived pagination values from the store state and filtered/sorted rows.
 */
export function usePagination<T extends RowData>(
  store: UseStoreApi<{
    pagination: { page: number; pageSize: number; totalRows: number };
    setPage: (page: number) => void;
    setPageSize: (pageSize: number) => void;
  }>,
  processedRows: T[],
): PaginationResult<T> {
  const pagination = store((s) => s.pagination);
  const setPage = store((s) => s.setPage);
  const setPageSize = store((s) => s.setPageSize);

  const totalRows = processedRows.length;

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(totalRows / pagination.pageSize)),
    [totalRows, pagination.pageSize],
  );

  const startIndex = useMemo(
    () => (pagination.page - 1) * pagination.pageSize,
    [pagination.page, pagination.pageSize],
  );

  const endIndex = useMemo(
    () => Math.min(startIndex + pagination.pageSize, totalRows),
    [startIndex, pagination.pageSize, totalRows],
  );

  const paginatedRows = useMemo(
    () => processedRows.slice(startIndex, endIndex),
    [processedRows, startIndex, endIndex],
  );

  const hasNextPage = pagination.page < totalPages;
  const hasPrevPage = pagination.page > 1;

  const nextPage = useCallback(() => {
    if (hasNextPage) setPage(pagination.page + 1);
  }, [hasNextPage, pagination.page, setPage]);

  const prevPage = useCallback(() => {
    if (hasPrevPage) setPage(pagination.page - 1);
  }, [hasPrevPage, pagination.page, setPage]);

  const goToPage = useCallback(
    (page: number) => {
      const clamped = Math.max(1, Math.min(page, totalPages));
      setPage(clamped);
    },
    [totalPages, setPage],
  );

  const handleSetPageSize = useCallback(
    (pageSize: number) => {
      setPageSize(pageSize);
    },
    [setPageSize],
  );

  return {
    totalPages,
    startIndex,
    endIndex,
    hasNextPage,
    hasPrevPage,
    paginatedRows,
    nextPage,
    prevPage,
    goToPage,
    setPageSize: handleSetPageSize,
  };
}
