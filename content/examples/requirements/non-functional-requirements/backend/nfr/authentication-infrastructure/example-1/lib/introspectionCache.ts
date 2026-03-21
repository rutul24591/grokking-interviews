type Value = { at: number; ttlMs: number; result: unknown };

const cache = new Map<string, Value>();
let stats = { lookups: 0, hits: 0 };

export function resetCache() {
  cache.clear();
  stats = { lookups: 0, hits: 0 };
}

export function cacheStats() {
  return stats;
}

export function cached<T>(key: string, ttlMs: number, compute: () => T): T {
  stats.lookups++;
  const now = Date.now();
  const v = cache.get(key);
  if (v && now - v.at <= v.ttlMs) {
    stats.hits++;
    return v.result as T;
  }
  const out = compute();
  cache.set(key, { at: now, ttlMs, result: out });
  return out;
}

