/**
 * Breadcrumb Dynamic ID Resolution — Converts numeric/UUID segments to labels.
 *
 * Interview edge case: URL is /products/12345/reviews. The "12345" segment is a
 * numeric ID, not a readable label. The breadcrumb must resolve this to a product
 * name (e.g., "Wireless Headphones"). For performance, cache resolved labels.
 */

interface ResolvedLabel {
  label: string;
  timestamp: number;
}

/**
 * Manages label resolution for URL segments that are IDs.
 * Uses a cache with TTL to avoid repeated API calls.
 */
export class BreadcrumbIdResolver {
  private cache: Map<string, ResolvedLabel> = new Map();
  private cacheTTL: number;
  private resolverFn: (id: string, segment: string) => Promise<string>;

  constructor(
    cacheTTL: number = 300000, // 5 minutes
    resolverFn: (id: string, segment: string) => Promise<string>,
  ) {
    this.cacheTTL = cacheTTL;
    this.resolverFn = resolverFn;
  }

  /**
   * Checks if a segment looks like an ID (numeric or UUID).
   */
  isIdSegment(segment: string): boolean {
    // Numeric ID
    if (/^\d+$/.test(segment)) return true;
    // UUID
    if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(segment)) return true;
    return false;
  }

  /**
   * Resolves an ID segment to a label. Uses cache if available.
   */
  async resolve(segment: string, parentPath: string): Promise<string> {
    const cacheKey = `${parentPath}/${segment}`;
    const cached = this.cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
      return cached.label;
    }

    try {
      const label = await this.resolverFn(segment, parentPath);
      this.cache.set(cacheKey, { label, timestamp: Date.now() });
      return label;
    } catch {
      // Fallback to the raw segment
      return segment;
    }
  }

  /**
   * Clears expired cache entries.
   */
  pruneCache(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache) {
      if (now - entry.timestamp >= this.cacheTTL) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Clears the entire cache.
   */
  clearCache(): void {
    this.cache.clear();
  }
}
