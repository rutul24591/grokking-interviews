// Infinite Scroll Engine — IntersectionObserver-based page loading
// Manages page tracking, loading state, error handling, and retry logic

import type { DataSource, InfiniteScrollConfig, PageResponse } from './virtualization-types';

export interface InfiniteScrollEngineState<T> {
  items: T[];
  page: number;
  isLoading: boolean;
  error: Error | null;
  hasMore: boolean;
  retryCount: number;
}

type StateListener<T> = (state: InfiniteScrollEngineState<T>) => void;

export class InfiniteScrollEngine<T> {
  private state: InfiniteScrollEngineState<T> = {
    items: [],
    page: 0,
    isLoading: false,
    error: null,
    hasMore: true,
    retryCount: 0,
  };

  private observer: IntersectionObserver | null = null;
  private listeners: Set<StateListener<T>> = new Set();
  private abortController: AbortController | null = null;
  private retryTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private readonly dataSource: DataSource<T>,
    private readonly config: InfiniteScrollConfig,
  ) {}

  /**
   * Initializes the engine and starts loading the first page.
   */
  init(): void {
    this.loadNextPage();
  }

  /**
   * Sets up the IntersectionObserver on the sentinel element.
   * Returns a callback to be used as the ref for the sentinel element.
   */
  createObserver(onVisible: () => void): (element: HTMLElement | null) => void {
    return (element: HTMLElement | null) => {
      // Clean up previous observer
      if (this.observer) {
        this.observer.disconnect();
        this.observer = null;
      }

      if (!element) return;

      this.observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (entry?.isIntersecting) {
            onVisible();
          }
        },
        {
          rootMargin: `0px 0px ${this.config.sentinelThreshold}px 0px`,
          threshold: 0,
        },
      );

      this.observer.observe(element);
    };
  }

  /**
   * Triggers loading of the next page.
   */
  async loadNextPage(): Promise<void> {
    if (this.state.isLoading || !this.state.hasMore) {
      return;
    }

    // Cancel any in-flight request
    if (this.abortController) {
      this.abortController.abort();
    }

    // Clear any pending retry timer
    if (this.retryTimer) {
      clearTimeout(this.retryTimer);
      this.retryTimer = null;
    }

    this.setState({
      isLoading: true,
      error: null,
      retryCount: 0,
    });

    this.abortController = new AbortController();
    const nextPage = this.state.page + 1;

    try {
      const response: PageResponse<T> = await this.dataSource.fetchPage(
        nextPage,
        this.config.pageSize,
        this.abortController.signal,
      );

      this.setState({
        items: [...this.state.items, ...response.items],
        page: nextPage,
        isLoading: false,
        hasMore: response.hasMore,
        retryCount: 0,
      });
    } catch (err) {
      // Ignore abort errors (component unmounted or new request started)
      if (err instanceof DOMException && err.name === 'AbortError') {
        return;
      }

      const error = err instanceof Error ? err : new Error(String(err));
      const retryCount = this.state.retryCount + 1;

      if (retryCount <= this.config.maxRetries) {
        // Schedule automatic retry with exponential backoff
        const delay = this.config.retryDelayMs * Math.pow(2, retryCount - 1);
        this.retryTimer = setTimeout(() => {
          this.loadNextPage();
        }, delay);

        this.setState({
          isLoading: false,
          error,
          retryCount,
        });
      } else {
        // Max retries exceeded, wait for manual retry
        this.setState({
          isLoading: false,
          error,
          retryCount,
        });
      }
    }
  }

  /**
   * Manual retry after an error.
   */
  retry(): void {
    if (this.state.error) {
      this.loadNextPage();
    }
  }

  /**
   * Resets the engine state and re-fetches from page 1.
   * Useful when filters or search parameters change.
   */
  reset(): void {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
    if (this.retryTimer) {
      clearTimeout(this.retryTimer);
      this.retryTimer = null;
    }

    this.observer?.disconnect();
    this.observer = null;

    this.setState({
      items: [],
      page: 0,
      isLoading: false,
      error: null,
      hasMore: true,
      retryCount: 0,
    });

    this.loadNextPage();
  }

  /**
   * Returns the current state.
   */
  getState(): InfiniteScrollEngineState<T> {
    return { ...this.state };
  }

  /**
   * Subscribes to state changes. Returns an unsubscribe function.
   */
  subscribe(listener: StateListener<T>): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Cleans up all resources.
   */
  destroy(): void {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
    if (this.retryTimer) {
      clearTimeout(this.retryTimer);
      this.retryTimer = null;
    }
    this.observer?.disconnect();
    this.observer = null;
    this.listeners.clear();
  }

  private setState(partial: Partial<InfiniteScrollEngineState<T>>): void {
    this.state = { ...this.state, ...partial };
    this.notifyListeners();
  }

  private notifyListeners(): void {
    const state = this.getState();
    for (const listener of this.listeners) {
      listener(state);
    }
  }
}
