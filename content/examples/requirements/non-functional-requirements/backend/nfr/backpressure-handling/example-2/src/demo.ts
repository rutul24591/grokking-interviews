class TokenBucket {
  private tokens: number;
  private last: number;
  constructor(
    private capacity: number,
    private refillPerSec: number,
  ) {
    this.tokens = capacity;
    this.last = Date.now();
  }
  allow() {
    const now = Date.now();
    const dt = (now - this.last) / 1000;
    this.last = now;
    this.tokens = Math.min(this.capacity, this.tokens + dt * this.refillPerSec);
    if (this.tokens >= 1) {
      this.tokens -= 1;
      return true;
    }
    return false;
  }
}

const bucket = new TokenBucket(5, 2); // burst 5, refill 2/s
const results = [];
for (let i = 0; i < 12; i++) results.push(bucket.allow());

console.log(JSON.stringify({ allowed: results.filter(Boolean).length, results }, null, 2));

