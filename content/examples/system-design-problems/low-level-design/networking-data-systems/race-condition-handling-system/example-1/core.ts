export type Versioned<T> = { version: number; value: T };

export function applyIfNewer<T>(prev: Versioned<T>, next: Versioned<T>) {
  if (next.version < prev.version) return prev;
  return next;
}
