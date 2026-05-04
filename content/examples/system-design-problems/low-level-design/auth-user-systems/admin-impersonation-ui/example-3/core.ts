export function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

export type Versioned<T> = { version: number; value: T };

export function applyIfNewer<T>(prev: Versioned<T>, next: Versioned<T>) {
  return next.version < prev.version ? prev : next;
}
