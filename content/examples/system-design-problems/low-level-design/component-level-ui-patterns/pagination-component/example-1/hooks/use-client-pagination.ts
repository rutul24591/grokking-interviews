import { useMemo } from "react";
import { usePaginationStore } from "../lib/pagination-store";
import type { UseClientPaginationReturn } from "../lib/pagination-types";

export function useClientPagination<T>(data: T[]): UseClientPaginationReturn<T> {
  const {
    currentPage,
    pageSize,
    goToPage,
    nextPage,
    prevPage,
    changePageSize,
  } = usePaginationStore();

  const totalItems = data.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  usePaginationStore.setState({ totalItems });

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return data.slice(startIndex, endIndex);
  }, [data, currentPage, pageSize]);

  return {
    paginatedData,
    currentPage,
    pageSize,
    totalItems,
    totalPages,
    goToPage,
    nextPage,
    prevPage,
    changePageSize,
  };
}
