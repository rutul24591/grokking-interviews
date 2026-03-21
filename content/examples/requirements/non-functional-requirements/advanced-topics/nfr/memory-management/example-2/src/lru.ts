export class LruCache<V> {
  private byKey = new Map<string, { value: V; sizeBytes: number; expiresAt: number }>();
  private totalBytes = 0;

  constructor(
    private readonly opts: { maxBytes: number; ttlMs: number },
  ) {}

  get bytes() {
    return this.totalBytes;
  }

  get size() {
    return this.byKey.size;
  }

  get(key: string): V | undefined {
    const now = Date.now();
    const e = this.byKey.get(key);
    if (!e) return undefined;
    if (e.expiresAt <= now) {
      this.delete(key);
      return undefined;
    }
    // refresh
    this.byKey.delete(key);
    this.byKey.set(key, e);
    return e.value;
  }

  set(key: string, value: V, sizeBytes: number) {
    if (this.byKey.has(key)) this.delete(key);
    const entry = { value, sizeBytes, expiresAt: Date.now() + this.opts.ttlMs };
    this.byKey.set(key, entry);
    this.totalBytes += sizeBytes;
    this.evict();
  }

  delete(key: string) {
    const e = this.byKey.get(key);
    if (!e) return;
    this.byKey.delete(key);
    this.totalBytes -= e.sizeBytes;
  }

  private evict() {
    const now = Date.now();
    for (const [k, e] of this.byKey) {
      if (e.expiresAt <= now) this.delete(k);
      else break;
    }
    while (this.totalBytes > this.opts.maxBytes && this.byKey.size > 0) {
      const oldest = this.byKey.keys().next().value as string;
      this.delete(oldest);
    }
  }
}

