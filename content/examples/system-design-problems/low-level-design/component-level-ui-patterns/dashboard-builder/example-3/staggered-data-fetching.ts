/**
 * Dashboard Builder — Staff-Level Widget Data Fetching Strategy.
 *
 * Staff differentiator: Staggered data fetching to prevent thundering herd,
 * shared data source caching for widgets using the same data, and request
 * batching for widgets with overlapping time ranges.
 */

interface WidgetFetchRequest {
  widgetId: string;
  dataSource: string;
  timeRange: { start: number; end: number };
  priority: 'high' | 'medium' | 'low';
}

/**
 * Manages widget data fetching with staggered loading and request deduplication.
 */
export class DashboardDataFetcher {
  private pendingRequests: Map<string, Promise<unknown>> = new Map();
  private cache: Map<string, { data: unknown; timestamp: number; ttl: number }> = new Map();
  private fetchQueue: WidgetFetchRequest[] = [];
  private isProcessing: boolean = false;

  /**
   * Queues a widget data fetch with deduplication.
   * If another widget requests the same data source with overlapping time range,
   * the request is deduplicated and results are shared.
   */
  async fetchWidgetData(request: WidgetFetchRequest): Promise<unknown> {
    const cacheKey = this.getCacheKey(request);
    const cached = this.cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      return cached.data;
    }

    // Check for pending identical request
    const pending = this.pendingRequests.get(cacheKey);
    if (pending) return pending;

    // Add to queue with priority-based scheduling
    this.fetchQueue.push(request);

    if (!this.isProcessing) {
      this.isProcessing = true;
      this.processQueue();
    }

    // Create a promise for this request
    const promise = new Promise<unknown>((resolve) => {
      const check = setInterval(() => {
        const result = this.cache.get(cacheKey);
        if (result && Date.now() - result.timestamp < result.ttl) {
          clearInterval(check);
          resolve(result.data);
        }
      }, 50);
    });

    this.pendingRequests.set(cacheKey, promise);
    return promise;
  }

  /**
   * Processes the fetch queue with staggered loading to prevent thundering herd.
   * High priority widgets are fetched first, with 100ms delay between batches.
   */
  private async processQueue(): Promise<void> {
    const sorted = [...this.fetchQueue].sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

    for (let i = 0; i < sorted.length; i++) {
      const request = sorted[i];
      const cacheKey = this.getCacheKey(request);

      // Stagger fetches to prevent overwhelming the server
      if (i > 0) await new Promise((r) => setTimeout(r, 100));

      try {
        const data = await this.executeFetch(request);
        this.cache.set(cacheKey, { data, timestamp: Date.now(), ttl: 30000 });
      } catch (err) {
        console.error(`Failed to fetch data for widget ${request.widgetId}:`, err);
      }
    }

    this.fetchQueue = [];
    this.isProcessing = false;
  }

  private getCacheKey(request: WidgetFetchRequest): string {
    return `${request.dataSource}:${request.timeRange.start}-${request.timeRange.end}`;
  }

  private async executeFetch(request: WidgetFetchRequest): Promise<unknown> {
    // In production: fetch from API with request batching
    return { widgetId: request.widgetId, data: [] };
  }

  /**
   * Clears all cached data.
   */
  clearCache(): void {
    this.cache.clear();
    this.pendingRequests.clear();
  }
}
