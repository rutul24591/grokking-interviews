/**
 * Infinite Scroll — Staff-Level Prefetching Strategy.
 *
 * Staff differentiator: Predictive prefetching based on scroll velocity,
 * intelligent cache eviction, and background data synchronization.
 */

/**
 * Predictive prefetch manager that fetches data before the user scrolls to it.
 * Uses scroll velocity to determine when to start prefetching.
 */
export class ScrollPrefetchManager<T> {
  private scrollVelocity: number = 0;
  private lastScrollTop: number = 0;
  private lastScrollTime: number = 0;
  private prefetchThreshold: number = 3; // Pages ahead to prefetch
  private cache: Map<number, T[]> = new Map();
  private maxCachePages: number = 10;
  private isPrefetching: boolean = false;

  /**
   * Updates scroll velocity based on scroll events.
   */
  onScroll(scrollTop: number): void {
    const now = Date.now();
    const dt = now - this.lastScrollTime;

    if (dt > 0) {
      this.scrollVelocity = Math.abs(scrollTop - this.lastScrollTop) / dt;
    }

    this.lastScrollTop = scrollTop;
    this.lastScrollTime = now;
  }

  /**
   * Determines how many pages ahead to prefetch based on scroll velocity.
   * Faster scrolling = more aggressive prefetching.
   */
  getPrefetchDistance(): number {
    if (this.scrollVelocity > 2) return 5; // Fast scroll — prefetch 5 pages ahead
    if (this.scrollVelocity > 1) return 3; // Medium scroll
    return 1; // Slow scroll — prefetch 1 page
  }

  /**
   * Checks if prefetching should be triggered.
   */
  shouldPrefetch(currentPage: number, totalPages: number): number[] {
    const distance = this.getPrefetchDistance();
    const pagesToPrefetch: number[] = [];

    for (let i = 1; i <= distance; i++) {
      const page = currentPage + i;
      if (page <= totalPages && !this.cache.has(page)) {
        pagesToPrefetch.push(page);
      }
    }

    return pagesToPrefetch;
  }

  /**
   * Caches page data and evicts old entries if cache is full.
   */
  cachePage(page: number, data: T[]): void {
    this.cache.set(page, data);

    // Evict oldest pages if cache is full
    while (this.cache.size > this.maxCachePages) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey !== undefined) this.cache.delete(oldestKey);
    }
  }

  /**
   * Gets cached page data.
   */
  getCachedPage(page: number): T[] | undefined {
    return this.cache.get(page);
  }

  /**
   * Clears the cache.
   */
  clearCache(): void {
    this.cache.clear();
  }
}
