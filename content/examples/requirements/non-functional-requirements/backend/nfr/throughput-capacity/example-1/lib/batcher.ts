import { setTimeout as delay } from "node:timers/promises";

type Stats = {
  accepted: number;
  processed: number;
  batches: number;
  last5sThroughput: number;
};

class MicroBatcher {
  private buffer: string[] = [];
  private flushTimer: NodeJS.Timeout | null = null;
  private accepted = 0;
  private processed = 0;
  private batches = 0;
  private processedTimestamps: number[] = [];
  private flushing = false;

  constructor(
    private readonly maxBatchSize: number,
    private readonly flushIntervalMs: number
  ) {}

  reset() {
    this.buffer = [];
    if (this.flushTimer) clearTimeout(this.flushTimer);
    this.flushTimer = null;
    this.accepted = 0;
    this.processed = 0;
    this.batches = 0;
    this.processedTimestamps = [];
    this.flushing = false;
  }

  accept(items: string[]) {
    this.accepted += items.length;
    this.buffer.push(...items);
    this.schedule();
    if (this.buffer.length >= this.maxBatchSize) void this.flush();
  }

  private schedule() {
    if (this.flushTimer) return;
    this.flushTimer = setTimeout(() => {
      this.flushTimer = null;
      void this.flush();
    }, this.flushIntervalMs);
  }

  private async flush() {
    if (this.flushing) return;
    if (this.buffer.length === 0) return;
    this.flushing = true;
    try {
      const batch = this.buffer.splice(0, this.maxBatchSize);
      this.batches++;

      // Simulate processing overhead + per-batch work.
      await delay(30);

      this.processed += batch.length;
      const now = Date.now();
      for (let i = 0; i < batch.length; i++) this.processedTimestamps.push(now);
      this.processedTimestamps = this.processedTimestamps.filter((t) => now - t <= 5000);

      if (this.buffer.length > 0) void this.flush();
    } finally {
      this.flushing = false;
    }
  }

  stats(): Stats {
    const now = Date.now();
    const in5s = this.processedTimestamps.filter((t) => now - t <= 5000).length;
    return {
      accepted: this.accepted,
      processed: this.processed,
      batches: this.batches,
      last5sThroughput: Math.round((in5s / 5) * 100) / 100
    };
  }
}

export const batcher = new MicroBatcher(10, 50);

