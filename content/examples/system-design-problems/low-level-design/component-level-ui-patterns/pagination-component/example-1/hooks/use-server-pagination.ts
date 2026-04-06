import { useState, useEffect, useRef, useCallback } from "react";
import { usePaginationStore } from "../lib/pagination-store";
import type { UseServerPaginationReturn, UseServerPaginationOptions } from "../lib/pagination-types";

interface ServerResponse<T> {
  data: T;
  totalItems: number;
  page: number;
  pageSize: number;
}

export function useServerPagination<T>(
  fetchUrl: string,
  options?: Omit<UseServerPaginationOptions, "fetchUrl">
): UseServerPaginationReturn<T> {
  const {
    currentPage,
    pageSize,
    goToPage,
    changePageSize,
  } = usePaginationStore();

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);
  const fetchUrlRef = useRef(fetchUrl);
  const optionsRef = useRef(options);

  fetchUrlRef.current = fetchUrl;
  optionsRef.current = options;

  const fetchData = useCallback(async (page: number, size: number) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      const buildQuery = optionsRef.current?.buildQuery ?? defaultBuildQuery;
      const queryParams = buildQuery(page, size);
      const queryString = new URLSearchParams(queryParams).toString();
      const url = `${fetchUrlRef.current}?${queryString}`;

      const response = await fetch(url, { signal: controller.signal });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result: ServerResponse<T> = await response.json();

      if (!controller.signal.aborted) {
        setData(result.data);
        usePaginationStore.getState().setTotalItems(result.totalItems);
        optionsRef.current?.onSuccess?.(result.data);
      }
    } catch (err) {
      if (!controller.signal.aborted) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        optionsRef.current?.onError?.(error);
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchData(currentPage, pageSize);

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [currentPage, pageSize, fetchData]);

  const refetch = useCallback(() => {
    fetchData(currentPage, pageSize);
  }, [currentPage, pageSize, fetchData]);

  const totalPages = usePaginationStore((state) => state.totalPages);

  return {
    data,
    loading,
    error,
    currentPage,
    pageSize,
    totalPages,
    goToPage,
    changePageSize,
    refetch,
  };
}

function defaultBuildQuery(page: number, pageSize: number): Record<string, string> {
  return {
    page: String(page),
    pageSize: String(pageSize),
  };
}
