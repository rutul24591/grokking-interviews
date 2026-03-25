export class TokenBucket {
  private tokens: number;
  private lastRefillMs: number;

  constructor(
    private readonly capacity: number,
    private readonly refillPerSec: number,
  ) {
    this.tokens = capacity;
    this.lastRefillMs = performance.now();
  }

  private refill(nowMs: number) {
    const elapsedSec = Math.max(0, (nowMs - this.lastRefillMs) / 1000);
    const refill = elapsedSec * this.refillPerSec;
    this.tokens = Math.min(this.capacity, this.tokens + refill);
    this.lastRefillMs = nowMs;
  }

  tryTake(n: number) {
    const now = performance.now();
    this.refill(now);
    if (this.tokens >= n) {
      this.tokens -= n;
      return true;
    }
    return false;
  }

  snapshot() {
    this.refill(performance.now());
    return { tokens: this.tokens, capacity: this.capacity, refillPerSec: this.refillPerSec };
  }
}

