class Histogram {
  private buckets: number[];
  private counts: number[];
  private sum = 0;
  private n = 0;

  constructor(bucketUpperBounds: number[]) {
    this.buckets = bucketUpperBounds;
    this.counts = bucketUpperBounds.map(() => 0);
  }

  observe(v: number) {
    this.sum += v;
    this.n++;
    const idx = this.buckets.findIndex((b) => v <= b);
    const i = idx === -1 ? this.counts.length - 1 : idx;
    this.counts[i]!++;
  }

  snapshot() {
    const cumulative: Array<{ le: number; count: number }> = [];
    let c = 0;
    for (let i = 0; i < this.buckets.length; i++) {
      c += this.counts[i]!;
      cumulative.push({ le: this.buckets[i]!, count: c });
    }
    return { n: this.n, avg: this.n ? this.sum / this.n : 0, cumulative };
  }
}

const h = new Histogram([50, 100, 200, 500, 1000]);
for (const v of [40, 55, 80, 120, 180, 240, 260, 420, 900]) h.observe(v);
console.log(JSON.stringify(h.snapshot(), null, 2));

