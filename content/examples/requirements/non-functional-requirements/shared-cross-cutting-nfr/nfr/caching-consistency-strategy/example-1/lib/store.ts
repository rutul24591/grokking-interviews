export type Record = { id: string; value: string; version: number; updatedAt: string };
export type CacheEntry = { key: string; value: string; version: number; cachedAt: number; ttlMs: number };
export type Strategy = "invalidation" | "versioned";

type Store = {
  db: Map<string, Record>;
  cache: Map<string, CacheEntry>;
  strategy: Strategy;
  ttlMs: number;
  inFlight: Map<string, Promise<Record>>;
};

const store: Store =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ((globalThis as any).__CACHE_STORE__ as Store | undefined) ?? {
    db: new Map([["item-1", { id: "item-1", value: "hello", version: 1, updatedAt: new Date().toISOString() }]]),
    cache: new Map(),
    strategy: "invalidation",
    ttlMs: 2000,
    inFlight: new Map(),
  };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).__CACHE_STORE__ = store;

export function getStore() {
  return store;
}

export function reset() {
  store.cache.clear();
  store.db.set("item-1", { id: "item-1", value: "hello", version: 1, updatedAt: new Date().toISOString() });
  store.strategy = "invalidation";
  store.ttlMs = 2000;
  store.inFlight.clear();
}

export function cacheKey(id: string, version: number | null, strategy: Strategy) {
  return strategy === "versioned" && version != null ? `${id}@v${version}` : id;
}

export function isFresh(e: CacheEntry) {
  return Date.now() - e.cachedAt <= e.ttlMs;
}

export async function loadFromDbSingleflight(id: string): Promise<Record> {
  const existing = store.inFlight.get(id);
  if (existing) return existing;
  const p = (async () => {
    // simulate DB latency
    await new Promise((r) => setTimeout(r, 40 + Math.floor(Math.random() * 60)));
    const rec = store.db.get(id);
    if (!rec) throw new Error("not_found");
    return rec;
  })().finally(() => {
    store.inFlight.delete(id);
  });
  store.inFlight.set(id, p);
  return p;
}

