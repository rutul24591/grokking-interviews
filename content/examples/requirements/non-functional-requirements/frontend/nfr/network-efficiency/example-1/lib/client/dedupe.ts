type Key = string;

const inflight = new Map<Key, Promise<Response>>();

export async function dedupedFetch(key: string, fn: () => Promise<Response>) {
  const existing = inflight.get(key);
  if (existing) return existing;
  const p = fn().finally(() => inflight.delete(key));
  inflight.set(key, p);
  return p;
}

