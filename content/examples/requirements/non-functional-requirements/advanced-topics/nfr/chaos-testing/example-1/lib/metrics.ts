export type TargetEvent = {
  ts: number;
  ok: boolean;
  status: number;
  latencyMs: number;
};

export class RollingWindow {
  private readonly maxSize: number;
  private items: TargetEvent[] = [];

  constructor(maxSize: number) {
    this.maxSize = maxSize;
  }

  push(event: TargetEvent) {
    this.items.push(event);
    if (this.items.length > this.maxSize) this.items.shift();
  }

  snapshot() {
    const items = this.items;
    const total = items.length;
    const ok = items.filter((e) => e.ok).length;
    const errors = total - ok;
    const errorRate = total === 0 ? 0 : errors / total;

    const latencies = items.map((e) => e.latencyMs).sort((a, b) => a - b);
    const p = (q: number) => {
      if (latencies.length === 0) return 0;
      const idx = Math.floor(q * (latencies.length - 1));
      return latencies[Math.max(0, Math.min(latencies.length - 1, idx))];
    };

    return {
      windowSize: this.maxSize,
      total,
      ok,
      errors,
      errorRate,
      latencyMs: {
        p50: p(0.5),
        p95: p(0.95),
        max: latencies.length ? latencies[latencies.length - 1] : 0,
      },
      updatedAt: new Date().toISOString(),
    };
  }
}

