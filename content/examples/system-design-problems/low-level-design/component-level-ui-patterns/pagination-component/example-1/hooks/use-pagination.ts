import { useMemo } from "react";
import { usePaginationStore } from "../lib/pagination-store";
import { computePageRange, computeRangeDisplay } from "../lib/page-range-calculator";
import type { UsePaginationReturn } from "../lib/pagination-types";

const DEFAULT_SIBLING_COUNT = 2;

export function usePagination(config?: { siblingCount?: number }): UsePaginationReturn {
  const {
    currentPage,
    pageSize,
    totalItems,
    goToPage,
    nextPage,
    prevPage,
    goToFirst,
    goToLast,
    changePageSize,
  } = usePaginationStore();

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  const siblingCount = config?.siblingCount ?? DEFAULT_SIBLING_COUNT;

  const pageRange = useMemo(() => {
    const range = computePageRange({ currentPage, totalPages, siblingCount });
    const display = computeRangeDisplay(currentPage, pageSize, totalItems);
    return {
      ...range,
      startItem: display.startItem,
      endItem: display.endItem,
      totalItems: display.totalItems,
    };
  }, [currentPage, totalPages, siblingCount, pageSize, totalItems]);

  const hasNext = currentPage < totalPages;
  const hasPrev = currentPage > 1;

  return {
    currentPage,
    pageSize,
    totalItems,
    totalPages,
    pageRange,
    hasNext,
    hasPrev,
    goToPage,
    nextPage,
    prevPage,
    goToFirst,
    goToLast,
    changePageSize,
  };
}
