export type BucketCounters = {
  total: number;
  good: number;
  bad: number;
};

export class TimeBuckets {
  private readonly bucketSizeMs: number;
  private readonly maxRetentionMs: number;
  private buckets: Map<number, BucketCounters> = new Map();

  constructor(params: { bucketSizeMs: number; maxRetentionMs: number }) {
    this.bucketSizeMs = params.bucketSizeMs;
    this.maxRetentionMs = params.maxRetentionMs;
  }

  ingest(tsMs: number, counters: { good: boolean }) {
    const start = Math.floor(tsMs / this.bucketSizeMs) * this.bucketSizeMs;
    const prev = this.buckets.get(start) ?? { total: 0, good: 0, bad: 0 };
    const next: BucketCounters = {
      total: prev.total + 1,
      good: prev.good + (counters.good ? 1 : 0),
      bad: prev.bad + (counters.good ? 0 : 1),
    };
    this.buckets.set(start, next);
    this.prune(tsMs);
  }

  reset() {
    this.buckets = new Map();
  }

  snapshot(params: { nowMs: number; windowMs: number }): BucketCounters {
    const { nowMs, windowMs } = params;
    const from = nowMs - windowMs;
    let total = 0;
    let good = 0;
    let bad = 0;
    for (const [start, c] of this.buckets.entries()) {
      if (start < from) continue;
      total += c.total;
      good += c.good;
      bad += c.bad;
    }
    return { total, good, bad };
  }

  private prune(nowMs: number) {
    const cutoff = nowMs - this.maxRetentionMs;
    for (const start of this.buckets.keys()) {
      if (start < cutoff) this.buckets.delete(start);
    }
  }
}

