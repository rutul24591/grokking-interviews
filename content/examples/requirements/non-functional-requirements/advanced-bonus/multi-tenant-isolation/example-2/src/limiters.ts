export class Semaphore {
  private readonly max: number;
  private inUse = 0;

  constructor(max: number) {
    this.max = Math.max(1, Math.floor(max));
  }

  tryAcquire() {
    if (this.inUse >= this.max) return false;
    this.inUse += 1;
    return true;
  }

  release() {
    this.inUse = Math.max(0, this.inUse - 1);
  }
}

export class TokenBucket {
  private readonly capacity: number;
  private readonly refillPerSec: number;
  private tokens: number;
  private lastMs: number;

  constructor(params: { capacity: number; refillPerSec: number }) {
    this.capacity = Math.max(1, params.capacity);
    this.refillPerSec = Math.max(0, params.refillPerSec);
    this.tokens = this.capacity;
    this.lastMs = Date.now();
  }

  take(cost = 1) {
    this.refill();
    if (this.tokens >= cost) {
      this.tokens -= cost;
      return true;
    }
    return false;
  }

  private refill() {
    const now = Date.now();
    const elapsedSec = (now - this.lastMs) / 1000;
    if (elapsedSec <= 0) return;
    this.tokens = Math.min(this.capacity, this.tokens + elapsedSec * this.refillPerSec);
    this.lastMs = now;
  }
}

