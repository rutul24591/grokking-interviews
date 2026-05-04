export type CacheValue<T> = { value: T; at: number; ttlMs: number; tags: string[] };

export function createTagCache<T>() {
  const byKey = new Map<string, CacheValue<T>>();
  const byTag = new Map<string, Set<string>>();

  function set(key: string, value: T, ttlMs: number, tags: string[]) {
    byKey.set(key, { value, at: Date.now(), ttlMs, tags });
    for (const t of tags) {
      const s = byTag.get(t) ?? new Set<string>();
      s.add(key);
      byTag.set(t, s);
    }
  }

  function get(key: string) {
    const e = byKey.get(key);
    if (!e) return null;
    if (Date.now() - e.at > e.ttlMs) return null;
    return e.value;
  }

  function invalidateTag(tag: string) {
    const keys = byTag.get(tag);
    if (!keys) return;
    for (const k of keys) byKey.delete(k);
    byTag.delete(tag);
  }

  return { set, get, invalidateTag };
}
