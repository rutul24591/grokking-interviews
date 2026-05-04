export type CacheEntry<T> = { at: number; ttlMs: number; value: T };

export function isFresh(e: CacheEntry<unknown>) {
  return Date.now() - e.at <= e.ttlMs;
}

export function createFetcher() {
  const cache = new Map<string, CacheEntry<unknown>>();
  const inflight = new Map<string, Promise<unknown>>();

  return async function fetchCached<T>(args: {
    key: string;
    ttlMs: number;
    fetcher: (signal: AbortSignal) => Promise<T>;
    signal?: AbortSignal;
  }): Promise<T> {
    const hit = cache.get(args.key);
    if (hit && isFresh(hit)) return hit.value as T;

    const existing = inflight.get(args.key);
    if (existing) return (await existing) as T;

    const ac = new AbortController();
    const p = args.fetcher(args.signal ?? ac.signal).then((value) => {
      cache.set(args.key, { at: Date.now(), ttlMs: args.ttlMs, value });
      return value;
    }).finally(() => inflight.delete(args.key));

    inflight.set(args.key, p as Promise<unknown>);
    return (await p) as T;
  };
}
