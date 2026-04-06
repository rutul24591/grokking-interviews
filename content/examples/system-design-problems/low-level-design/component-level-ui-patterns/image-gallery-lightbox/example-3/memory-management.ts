/**
 * Image Gallery — Staff-Level Memory Management for Large Galleries.
 *
 * Staff differentiator: Image preloading with LRU cache, memory-aware
 * thumbnail generation, and IntersectionObserver-based lazy loading with
 * prefetch threshold.
 */

/**
 * Image cache with LRU eviction and memory tracking.
 * Automatically evicts least recently used images when memory threshold is exceeded.
 */
export class ImageMemoryCache {
  private cache: Map<string, { blob: Blob; lastAccessed: number; size: number }> = new Map();
  private maxMemoryBytes: number;
  private currentMemoryBytes: number = 0;

  constructor(maxMemoryMB: number = 50) {
    this.maxMemoryBytes = maxMemoryMB * 1024 * 1024;
  }

  /**
   * Adds an image to the cache. Evicts LRU entries if memory threshold is exceeded.
   */
  async set(url: string, response: Response): Promise<void> {
    const blob = await response.blob();
    const size = blob.size;

    // Evict if necessary
    while (this.currentMemoryBytes + size > this.maxMemoryBytes && this.cache.size > 0) {
      this.evictLRU();
    }

    this.cache.set(url, { blob, lastAccessed: Date.now(), size });
    this.currentMemoryBytes += size;
  }

  /**
   * Gets an image from the cache. Updates lastAccessed for LRU tracking.
   */
  get(url: string): Blob | null {
    const entry = this.cache.get(url);
    if (!entry) return null;
    entry.lastAccessed = Date.now();
    return entry.blob;
  }

  /**
   * Evicts the least recently used entry.
   */
  private evictLRU(): void {
    let lruKey: string | null = null;
    let lruTime = Infinity;

    for (const [key, entry] of this.cache) {
      if (entry.lastAccessed < lruTime) {
        lruTime = entry.lastAccessed;
        lruKey = key;
      }
    }

    if (lruKey) {
      const entry = this.cache.get(lruKey)!;
      this.currentMemoryBytes -= entry.size;
      this.cache.delete(lruKey);
    }
  }

  /**
   * Returns cache statistics.
   */
  getStats(): { count: number; memoryMB: number; maxMemoryMB: number } {
    return {
      count: this.cache.size,
      memoryMB: this.currentMemoryBytes / (1024 * 1024),
      maxMemoryMB: this.maxMemoryBytes / (1024 * 1024),
    };
  }
}
