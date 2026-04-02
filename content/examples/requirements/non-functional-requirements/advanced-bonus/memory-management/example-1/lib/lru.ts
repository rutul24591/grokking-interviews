export type LruEntry<V> = {
  key: string;
  value: V;
  sizeBytes: number;
  expiresAt: number;
};

export class LruCache<V> {
  private byKey = new Map<string, LruEntry<V>>();
  private totalBytes = 0;

  constructor(
    private readonly opts: { maxBytes: number; ttlMs: number },
  ) {}

  get size() {
    return this.byKey.size;
  }

  get bytes() {
    return this.totalBytes;
  }

  getOrSet(key: string, factory: () => { value: V; sizeBytes: number }): V {
    const now = Date.now();
    const existing = this.byKey.get(key);
    if (existing && existing.expiresAt > now) {
      // refresh recency
      this.byKey.delete(key);
      this.byKey.set(key, existing);
      return existing.value;
    }
    if (existing) this.delete(key);

    const created = factory();
    const entry: LruEntry<V> = {
      key,
      value: created.value,
      sizeBytes: created.sizeBytes,
      expiresAt: now + this.opts.ttlMs,
    };
    this.byKey.set(key, entry);
    this.totalBytes += entry.sizeBytes;
    this.evict(now);
    return entry.value;
  }

  delete(key: string) {
    const e = this.byKey.get(key);
    if (!e) return;
    this.byKey.delete(key);
    this.totalBytes -= e.sizeBytes;
  }

  clear() {
    this.byKey.clear();
    this.totalBytes = 0;
  }

  private evict(now: number) {
    // Drop expired first.
    for (const [k, e] of this.byKey) {
      if (e.expiresAt <= now) this.delete(k);
      else break; // Map is in recency order; not strict for expiry but ok for demo.
    }
    // Enforce byte cap.
    while (this.totalBytes > this.opts.maxBytes && this.byKey.size > 0) {
      const oldestKey = this.byKey.keys().next().value as string;
      this.delete(oldestKey);
    }
  }
}

