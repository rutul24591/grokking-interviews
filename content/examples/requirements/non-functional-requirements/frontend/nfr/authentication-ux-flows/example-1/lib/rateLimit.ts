type Bucket = { count: number; resetAtMs: number };

export class FixedWindowRateLimiter {
  private buckets = new Map<string, Bucket>();

  constructor(
    private readonly opts: { keyPrefix: string; windowMs: number; max: number },
  ) {}

  consume(key: string, nowMs = Date.now()): { ok: true } | { ok: false; retryAfterMs: number } {
    const full = `${this.opts.keyPrefix}:${key}`;
    const b = this.buckets.get(full);
    if (!b || nowMs >= b.resetAtMs) {
      this.buckets.set(full, { count: 1, resetAtMs: nowMs + this.opts.windowMs });
      return { ok: true };
    }
    if (b.count >= this.opts.max) return { ok: false, retryAfterMs: Math.max(0, b.resetAtMs - nowMs) };
    b.count++;
    return { ok: true };
  }
}

