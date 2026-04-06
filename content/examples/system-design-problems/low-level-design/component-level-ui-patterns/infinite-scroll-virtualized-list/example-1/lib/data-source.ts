// Data Source — Abstract interface and concrete implementations
// Supports REST API with AbortController and WebSocket for real-time feeds

import type { DataSource, FeedEvent, PageResponse } from './virtualization-types';

// --- Abstract interface (already defined in types, re-exported for convenience) ---
// DataSource<T> { fetchPage(page, pageSize, signal): Promise<PageResponse<T>> }

// --- REST API Data Source ---

export interface RestApiDataSourceOptions {
  /**
   * Builds the URL for a given page and page size.
   * Example: (page, pageSize) => `/api/items?page=${page}&limit=${pageSize}`
   */
  buildUrl: (page: number, pageSize: number) => string;

  /**
   * Headers to include in the fetch request.
   */
  headers?: Record<string, string>;

  /**
   * Parses the fetch response into a PageResponse.
   * Default: assumes { items: data[], hasMore: boolean } shape.
   */
  parseResponse?: (response: Response) => Promise<PageResponse<unknown>>;
}

export class RestApiDataSource<T> implements DataSource<T> {
  private readonly options: Required<
    Omit<RestApiDataSourceOptions, 'headers'>
  > & { headers: Record<string, string> };

  constructor(options: RestApiDataSourceOptions) {
    this.options = {
      buildUrl: options.buildUrl,
      headers: options.headers ?? {},
      parseResponse:
        options.parseResponse ??
        (async (res: Response) => {
          const data = (await res.json()) as {
            data: T[];
            hasMore: boolean;
          };
          return { items: data.data as T[], hasMore: data.hasMore };
        }),
    };
  }

  async fetchPage(
    page: number,
    pageSize: number,
    signal?: AbortSignal,
  ): Promise<PageResponse<T>> {
    const url = this.options.buildUrl(page, pageSize);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...this.options.headers,
      },
      signal,
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch page ${page}: ${response.status} ${response.statusText}`,
      );
    }

    return this.options.parseResponse(response) as Promise<PageResponse<T>>;
  }
}

// --- WebSocket Data Source ---

export interface WebSocketDataSourceOptions {
  /**
   * WebSocket endpoint URL.
   */
  url: string;

  /**
   * Parses incoming WebSocket messages into feed events.
   */
  parseMessage: (data: string) => FeedEvent<unknown> | null;

  /**
   * Called when the connection is established.
   */
  onConnected?: () => void;

  /**
   * Called when the connection is lost.
   */
  onDisconnected?: () => void;

  /**
   * Called when an error occurs.
   */
  onError?: (error: Event) => void;
}

type FeedListener<T> = (event: FeedEvent<T>) => void;

export class WebSocketDataSource<T> implements DataSource<T> {
  private ws: WebSocket | null = null;
  private listeners: Set<FeedListener<T>> = new Set();
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  constructor(private readonly options: WebSocketDataSourceOptions) {}

  /**
   * For WebSocket, fetchPage is used for the initial data load (via REST fallback).
   * The WebSocket connection handles real-time updates only.
   */
  async fetchPage(
    page: number,
    pageSize: number,
    signal?: AbortSignal,
  ): Promise<PageResponse<T>> {
    // Initial load still uses REST — WebSocket is for real-time updates only
    // This is a common pattern: REST for pagination, WebSocket for live updates
    throw new Error(
      'WebSocketDataSource does not support fetchPage. ' +
        'Use RestApiDataSource for initial pagination and WebSocket for real-time updates.',
    );
  }

  /**
   * Connects to the WebSocket endpoint.
   */
  connect(): void {
    if (this.ws?.readyState === WebSocket.OPEN || this.ws?.readyState === WebSocket.CONNECTING) {
      return;
    }

    try {
      this.ws = new WebSocket(this.options.url);

      this.ws.onopen = () => {
        this.reconnectAttempts = 0;
        this.options.onConnected?.();
      };

      this.ws.onmessage = (event: MessageEvent) => {
        const feedEvent = this.options.parseMessage(event.data);
        if (feedEvent) {
          this.notifyListeners(feedEvent as FeedEvent<T>);
        }
      };

      this.ws.onclose = () => {
        this.options.onDisconnected?.();
        this.scheduleReconnect();
      };

      this.ws.onerror = (error: Event) => {
        this.options.onError?.(error);
      };
    } catch {
      this.scheduleReconnect();
    }
  }

  /**
   * Disconnects from the WebSocket.
   */
  disconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  /**
   * Subscribes to feed events. Returns an unsubscribe function.
   */
  onEvent(listener: FeedListener<T>): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      return;
    }

    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts);
    this.reconnectTimer = setTimeout(() => {
      this.reconnectAttempts++;
      this.connect();
    }, delay);
  }

  private notifyListeners(event: FeedEvent<T>): void {
    for (const listener of this.listeners) {
      listener(event);
    }
  }
}

// --- Mock Data Source (for testing) ---

export class MockDataSource<T> implements DataSource<T> {
  private readonly allItems: T[];
  private readonly delay: number;
  private failOnPage?: number;

  constructor(
    items: T[],
    options?: { delay?: number; failOnPage?: number },
  ) {
    this.allItems = items;
    this.delay = options?.delay ?? 100;
    this.failOnPage = options?.failOnPage;
  }

  async fetchPage(
    page: number,
    pageSize: number,
    signal?: AbortSignal,
  ): Promise<PageResponse<T>> {
    if (signal?.aborted) {
      throw new DOMException('Aborted', 'AbortError');
    }

    if (page === this.failOnPage) {
      throw new Error(`Simulated failure on page ${page}`);
    }

    await new Promise<void>((resolve, reject) => {
      const timer = setTimeout(resolve, this.delay);
      signal?.addEventListener('abort', () => {
        clearTimeout(timer);
        reject(new DOMException('Aborted', 'AbortError'));
      });
    });

    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const items = this.allItems.slice(start, end);
    const hasMore = end < this.allItems.length;

    return { items, hasMore };
  }
}
