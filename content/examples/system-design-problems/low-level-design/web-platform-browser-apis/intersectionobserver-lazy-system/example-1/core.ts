export type LazyItem = { id: string; loaded: boolean; priority: number };

export function markVisible(items: LazyItem[], id: string) {
  return items.map((it) => (it.id === id ? { ...it, loaded: true } : it));
}

export function pickPrefetch(items: LazyItem[], count: number) {
  return [...items].filter((i) => !i.loaded).sort((a, b) => b.priority - a.priority).slice(0, count);
}
