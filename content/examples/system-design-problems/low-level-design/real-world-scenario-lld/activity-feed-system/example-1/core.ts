export type Item = { id: string; ts: number; kind: string; summary: string };

export function mergeFeed(prev: Item[], incoming: Item[]) {
  const byId = new Map(prev.map((i) => [i.id, i]));
  for (const i of incoming) byId.set(i.id, i);
  return [...byId.values()].sort((a, b) => b.ts - a.ts);
}
