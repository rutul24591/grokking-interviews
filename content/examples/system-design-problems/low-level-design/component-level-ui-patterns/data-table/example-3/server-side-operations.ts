/**
 * Data Table — Staff-Level Server-Side Operations Pipeline.
 *
 * Staff differentiator: Server-side sorting, filtering, and pagination
 * with request batching, query optimization hints, and response caching.
 */

export interface ServerSideTableRequest {
  page: number;
  pageSize: number;
  sort?: { column: string; direction: 'asc' | 'desc' };
  filters?: { column: string; operator: string; value: unknown }[];
}

export interface ServerSideTableResponse<T> {
  data: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  cached: boolean;
  responseTimeMs: number;
}

/**
 * Manages server-side table operations with request caching and batching.
 */
export class ServerSideTableManager<T> {
  private cache: Map<string, { response: ServerSideTableResponse<T>; timestamp: number }> = new Map();
  private readonly cacheTTL: number = 30000; // 30 seconds
  private pendingRequests: Map<string, Promise<ServerSideTableResponse<T>>> = new Map();

  /**
   * Generates a cache key from the request parameters.
   */
  private getCacheKey(request: ServerSideTableRequest): string {
    return JSON.stringify(request);
  }

  /**
   * Fetches data from the server with caching and deduplication.
   */
  async fetchData(
    request: ServerSideTableRequest,
    fetchFn: (request: ServerSideTableRequest) => Promise<ServerSideTableResponse<T>>,
  ): Promise<ServerSideTableResponse<T>> {
    const cacheKey = this.getCacheKey(request);
    const startTime = Date.now();

    // Check cache
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
      return { ...cached.response, cached: true, responseTimeMs: Date.now() - startTime };
    }

    // Check pending request (deduplication)
    const pending = this.pendingRequests.get(cacheKey);
    if (pending) return pending;

    // Create new request
    const promise = fetchFn(request).then((response) => {
      this.cache.set(cacheKey, { response: { ...response, cached: false }, timestamp: Date.now() });
      this.pendingRequests.delete(cacheKey);
      return { ...response, responseTimeMs: Date.now() - startTime };
    });

    this.pendingRequests.set(cacheKey, promise);
    return promise;
  }

  /**
   * Clears the cache.
   */
  clearCache(): void {
    this.cache.clear();
    this.pendingRequests.clear();
  }

  /**
   * Prunes expired cache entries.
   */
  pruneCache(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache) {
      if (now - entry.timestamp >= this.cacheTTL) {
        this.cache.delete(key);
      }
    }
  }
}
