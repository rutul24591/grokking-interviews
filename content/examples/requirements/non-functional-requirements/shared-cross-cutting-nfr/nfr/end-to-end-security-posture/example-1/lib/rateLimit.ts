type Bucket = { count: number; resetAtMs: number };

export class FixedWindowRateLimiter {
  private buckets = new Map<string, Bucket>();

  constructor(
    private readonly opts: {
      windowMs: number;
      max: number;
      keyPrefix: string;
    },
  ) {}

  consume(key: string, nowMs = Date.now()): { ok: true } | { ok: false; retryAfterMs: number } {
    const fullKey = `${this.opts.keyPrefix}:${key}`;
    const existing = this.buckets.get(fullKey);
    if (!existing || nowMs >= existing.resetAtMs) {
      this.buckets.set(fullKey, { count: 1, resetAtMs: nowMs + this.opts.windowMs });
      return { ok: true };
    }

    if (existing.count >= this.opts.max) {
      return { ok: false, retryAfterMs: Math.max(0, existing.resetAtMs - nowMs) };
    }

    existing.count++;
    return { ok: true };
  }
}

