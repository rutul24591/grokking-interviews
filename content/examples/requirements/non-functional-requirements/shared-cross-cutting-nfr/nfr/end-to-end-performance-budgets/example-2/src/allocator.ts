export type Hop = { name: string; weight: number };

export function allocate(totalMs: number, hops: Hop[]) {
  const sum = hops.reduce((a, h) => a + h.weight, 0);
  return hops.map((h) => ({ name: h.name, budgetMs: (totalMs * h.weight) / sum }));
}

