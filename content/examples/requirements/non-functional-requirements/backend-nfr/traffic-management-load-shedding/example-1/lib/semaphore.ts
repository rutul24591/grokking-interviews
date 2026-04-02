import { setTimeout as delay } from "node:timers/promises";

type Waiter = { resolve: (release: () => void) => void; createdAt: number };

export class Semaphore {
  private active = 0;
  private queue: Waiter[] = [];

  constructor(private readonly max: number, private readonly maxQueue: number) {}

  snapshot() {
    return { active: this.active, max: this.max, queued: this.queue.length, maxQueue: this.maxQueue };
  }

  tryAcquire(): (() => void) | null {
    if (this.active >= this.max) return null;
    this.active++;
    return () => this.release();
  }

  async acquire(): Promise<() => void> {
    const fast = this.tryAcquire();
    if (fast) return fast;
    if (this.queue.length >= this.maxQueue) throw new Error("queue_full");
    return new Promise<() => void>((resolve) => {
      this.queue.push({ resolve, createdAt: Date.now() });
    });
  }

  private release() {
    this.active = Math.max(0, this.active - 1);
    const next = this.queue.shift();
    if (!next) return;
    this.active++;
    next.resolve(() => this.release());
  }

  async work(durationMs: number) {
    await delay(durationMs);
  }
}

