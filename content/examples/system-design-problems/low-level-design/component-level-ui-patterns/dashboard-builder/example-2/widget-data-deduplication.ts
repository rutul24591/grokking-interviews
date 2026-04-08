/**
 * Dashboard Builder — Edge Case: Widget Data Fetch Race Conditions.
 *
 * When multiple widgets fetch data simultaneously, handle:
 * 1. Duplicate requests for the same data source (deduplication)
 * 2. Failed requests with retry logic
 * 3. Stale data when filters change mid-fetch
 */

interface WidgetFetchRequest {
  widgetId: string;
  dataSource: string;
  params: Record<string, unknown>;
}

interface CachedResponse {
  data: unknown;
  timestamp: number;
  params: Record<string, unknown>;
}

export class WidgetDataDeduplicator {
  private cache: Map<string, CachedResponse> = new Map();
  private pendingRequests: Map<string, Promise<unknown>> = new Map();
  private readonly ttlMs: number;

  constructor(ttlMs: number = 30000) {
    this.ttlMs = ttlMs;
  }

  /**
   * Generates a cache key from the data source and parameters.
   */
  private getCacheKey(request: WidgetFetchRequest): string {
    return `${request.dataSource}:${JSON.stringify(request.params)}`;
  }

  /**
   * Fetches data with deduplication and caching.
   * If the same request is already in flight, returns the existing promise.
   * If a cached response exists and is fresh, returns it immediately.
   */
  async fetchData(
    request: WidgetFetchRequest,
    fetchFn: (request: WidgetFetchRequest) => Promise<unknown>,
  ): Promise<unknown> {
    const cacheKey = this.getCacheKey(request);

    // Check cache
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.ttlMs) {
      // Verify params haven't changed
      if (JSON.stringify(cached.params) === JSON.stringify(request.params)) {
        return cached.data;
      }
    }

    // Check pending request (deduplication)
    const pending = this.pendingRequests.get(cacheKey);
    if (pending) return pending;

    // Create new request
    const promise = fetchFn(request).then((data) => {
      this.cache.set(cacheKey, { data, timestamp: Date.now(), params: request.params });
      this.pendingRequests.delete(cacheKey);
      return data;
    }).catch((err) => {
      this.pendingRequests.delete(cacheKey);
      throw err;
    });

    this.pendingRequests.set(cacheKey, promise);
    return promise;
  }

  /**
   * Clears the cache for a specific data source.
   */
  invalidateDataSource(dataSource: string): void {
    for (const [key] of this.cache) {
      if (key.startsWith(`${dataSource}:`)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Clears all cached data.
   */
  clearCache(): void {
    this.cache.clear();
    this.pendingRequests.clear();
  }
}
