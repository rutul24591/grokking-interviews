type Bucket = {
  tokens: number;
  lastRefillMs: number;
  violations: number;
  penaltyUntilMs: number;
};

export type RateLimitDecision =
  | { allowed: true; remaining: number; resetInMs: number }
  | { allowed: false; retryAfterMs: number; penalty: boolean };

export class TokenBucketLimiter {
  private buckets = new Map<string, Bucket>();

  constructor(
    private readonly capacity: number,
    private readonly refillPerSecond: number,
    private readonly penaltyMs: number
  ) {}

  private bucket(key: string): Bucket {
    const b = this.buckets.get(key);
    if (b) return b;
    const init: Bucket = { tokens: this.capacity, lastRefillMs: Date.now(), violations: 0, penaltyUntilMs: 0 };
    this.buckets.set(key, init);
    return init;
  }

  decide(key: string): RateLimitDecision {
    const now = Date.now();
    const b = this.bucket(key);

    if (now < b.penaltyUntilMs) {
      return { allowed: false, retryAfterMs: b.penaltyUntilMs - now, penalty: true };
    }

    const elapsed = Math.max(0, now - b.lastRefillMs);
    const refill = (elapsed / 1000) * this.refillPerSecond;
    b.tokens = Math.min(this.capacity, b.tokens + refill);
    b.lastRefillMs = now;

    if (b.tokens >= 1) {
      b.tokens -= 1;
      return { allowed: true, remaining: Math.floor(b.tokens), resetInMs: Math.ceil((1 / this.refillPerSecond) * 1000) };
    }

    b.violations++;
    if (b.violations >= 5) {
      b.penaltyUntilMs = now + this.penaltyMs;
      b.violations = 0;
      return { allowed: false, retryAfterMs: this.penaltyMs, penalty: true };
    }

    const retryAfterMs = Math.ceil((1 / this.refillPerSecond) * 1000);
    return { allowed: false, retryAfterMs, penalty: false };
  }
}

export const limiter = new TokenBucketLimiter(10, 5, 2000);

