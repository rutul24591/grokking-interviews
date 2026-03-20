export type Item = { id: string; title: string; score: number };

export function buildItems(count: number): Item[] {
  const items: Item[] = [];
  for (let i = 0; i < count; i += 1) {
    items.push({
      id: `item-${i + 1}`,
      title: `Article ${i + 1}: Rendering Strategy Notes`,
      score: (i * 17) % 100,
    });
  }
  return items;
}

