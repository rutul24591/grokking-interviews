export type ItemId = string;

export type ReorderIntent = {
  fromIndex: number;
  toIndex: number;
};

export function reorder<T>(items: T[], intent: ReorderIntent) {
  const { fromIndex, toIndex } = intent;
  if (fromIndex === toIndex) return items;
  const next = items.slice();
  const [moved] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, moved);
  return next;
}

// Keyboard accessibility: derive next index from arrow keys.
export function moveIndex(current: number, key: "ArrowUp" | "ArrowDown", count: number) {
  if (key === "ArrowUp") return Math.max(0, current - 1);
  return Math.min(count - 1, current + 1);
}
