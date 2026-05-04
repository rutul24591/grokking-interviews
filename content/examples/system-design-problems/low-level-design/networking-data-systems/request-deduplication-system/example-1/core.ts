export function createDeduper() {
  const inflight = new Map<string, Promise<unknown>>();

  return async function dedupe<T>(key: string, fn: () => Promise<T>) {
    const existing = inflight.get(key);
    if (existing) return (await existing) as T;
    const p = fn().finally(() => inflight.delete(key));
    inflight.set(key, p as Promise<unknown>);
    return (await p) as T;
  };
}
