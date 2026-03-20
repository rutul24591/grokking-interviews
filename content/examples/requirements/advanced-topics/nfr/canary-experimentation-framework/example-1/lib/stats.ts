export class RecentLatencies {
  private readonly maxSize: number;
  private values: number[] = [];

  constructor(maxSize: number) {
    this.maxSize = maxSize;
  }

  push(ms: number) {
    this.values.push(ms);
    if (this.values.length > this.maxSize) this.values.shift();
  }

  reset() {
    this.values = [];
  }

  snapshot() {
    const values = [...this.values].sort((a, b) => a - b);
    const p = (q: number) => {
      if (!values.length) return 0;
      const idx = Math.floor(q * (values.length - 1));
      return values[Math.max(0, Math.min(values.length - 1, idx))];
    };
    return {
      p50: p(0.5),
      p95: p(0.95),
      max: values.length ? values[values.length - 1] : 0,
      count: values.length,
    };
  }
}

