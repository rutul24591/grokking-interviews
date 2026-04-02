export class Histogram {
  private buckets: number[];
  private count = 0;

  constructor(
    private readonly min: number,
    private readonly max: number,
    private readonly bucketsN: number,
  ) {
    this.buckets = Array.from({ length: bucketsN }, () => 0);
  }

  add(x: number) {
    const clamped = Math.max(this.min, Math.min(this.max, x));
    const idx = Math.min(
      this.bucketsN - 1,
      Math.floor(((clamped - this.min) / (this.max - this.min)) * this.bucketsN),
    );
    this.buckets[idx] += 1;
    this.count += 1;
  }

  percentile(p: number): number {
    if (this.count === 0) return 0;
    const target = Math.ceil(this.count * p);
    let acc = 0;
    for (let i = 0; i < this.buckets.length; i++) {
      acc += this.buckets[i];
      if (acc >= target) {
        const start = this.min + ((this.max - this.min) * i) / this.bucketsN;
        return start;
      }
    }
    return this.max;
  }
}

