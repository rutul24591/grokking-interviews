export type Point = { ts: number; value: number };

export function aggregateIntoBuckets(points: Point[], bucketMs: number) {
  const buckets = new Map<number, { sum: number; count: number }>();
  for (const p of points) {
    const b = Math.floor(p.ts / bucketMs) * bucketMs;
    const cur = buckets.get(b) ?? { sum: 0, count: 0 };
    cur.sum += p.value;
    cur.count += 1;
    buckets.set(b, cur);
  }
  return [...buckets.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([ts, v]) => ({ ts, avg: v.sum / v.count }));
}

