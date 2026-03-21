export class MemoryBreaker {
  private disabledUntil = 0;

  constructor(
    private readonly opts: { maxHeapUsedBytes: number; coolDownMs: number },
  ) {}

  canCache(now = Date.now()): boolean {
    if (now < this.disabledUntil) return false;
    const heapUsed = process.memoryUsage().heapUsed;
    if (heapUsed > this.opts.maxHeapUsedBytes) {
      this.disabledUntil = now + this.opts.coolDownMs;
      return false;
    }
    return true;
  }
}

