export type PaginationMode = "client" | "server";

export interface PaginationState {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  syncToUrl: boolean;
}

export interface PaginationConfig {
  siblingCount: number;
  pageSizeOptions: number[];
  showFirstLast: boolean;
  showRangeText: boolean;
  mode: PaginationMode;
}

export type PageItemType = "page" | "ellipsis";

export interface PageItem {
  type: "page";
  value: number;
}

export interface EllipsisItem {
  type: "ellipsis";
  value: null;
}

export type PaginationItem = PageItem | EllipsisItem;

export interface PageRange {
  items: PaginationItem[];
  startItem: number;
  endItem: number;
  totalItems: number;
}

export interface UsePaginationReturn {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  pageRange: PageRange;
  hasNext: boolean;
  hasPrev: boolean;
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  goToFirst: () => void;
  goToLast: () => void;
  changePageSize: (size: number) => void;
}

export interface UseClientPaginationReturn<T> {
  paginatedData: T[];
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  changePageSize: (size: number) => void;
}

export interface UseServerPaginationOptions {
  fetchUrl: string;
  buildQuery?: (page: number, pageSize: number) => Record<string, string>;
  onSuccess?: (data: unknown) => void;
  onError?: (error: Error) => void;
}

export interface UseServerPaginationReturn<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  goToPage: (page: number) => void;
  changePageSize: (size: number) => void;
  refetch: () => void;
}
