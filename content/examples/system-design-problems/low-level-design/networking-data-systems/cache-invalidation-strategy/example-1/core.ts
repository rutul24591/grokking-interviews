export type Tag = string;

export type TaggedKey = { key: string; tags: Tag[] };

export function buildInvalidationPlan(mutations: Array<{ affects: Tag[] }>, cacheIndex: Map<Tag, Set<string>>) {
  const keys = new Set<string>();
  for (const m of mutations) {
    for (const t of m.affects) {
      const ks = cacheIndex.get(t);
      if (!ks) continue;
      for (const k of ks) keys.add(k);
    }
  }
  return [...keys];
}
