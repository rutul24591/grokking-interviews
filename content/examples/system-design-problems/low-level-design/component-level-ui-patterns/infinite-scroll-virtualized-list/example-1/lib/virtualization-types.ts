// Core type definitions for virtualized list and infinite scroll

export interface VirtualItem<T = unknown> {
  index: number;
  offset: number;
  size: number;
  key: string;
  data: T;
}

export interface ScrollState {
  scrollTop: number;
  viewportHeight: number;
  totalHeight: number;
}

export interface PageResponse<T> {
  items: T[];
  hasMore: boolean;
  nextPage?: number;
}

export interface DataSource<T> {
  fetchPage(page: number, pageSize: number, signal?: AbortSignal): Promise<PageResponse<T>>;
}

export interface InfiniteScrollConfig {
  pageSize: number;
  overscan: number;
  estimatedItemSize: number;
  sentinelThreshold: number; // pixels before bottom to trigger load
  maxRetries: number;
  retryDelayMs: number;
}

export interface HeightCache {
  get(index: number): number | undefined;
  set(index: number, size: number): void;
  has(index: number): boolean;
  delete(index: number): boolean;
  clear(): void;
  entries(): IterableIterator<[number, number]>;
}

export interface InfiniteScrollState<T> {
  items: T[];
  page: number;
  isLoading: boolean;
  error: Error | null;
  hasMore: boolean;
  retryCount: number;
}

export type ScrollEvent = {
  type: 'scroll';
  scrollTop: number;
};

export type ResizeEvent = {
  type: 'resize';
  index: number;
  newSize: number;
};

export type FeedEvent<T> =
  | { type: 'items_added'; items: T[]; atIndex: number }
  | { type: 'items_removed'; indices: number[] }
  | { type: 'items_updated'; updates: { index: number; data: T }[] };

export const DEFAULT_CONFIG: InfiniteScrollConfig = {
  pageSize: 20,
  overscan: 5,
  estimatedItemSize: 100,
  sentinelThreshold: 200,
  maxRetries: 3,
  retryDelayMs: 1000,
};
