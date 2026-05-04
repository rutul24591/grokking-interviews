export type Persisted<T> = { version: number; value: T; updatedAt: number };

export function serialize<T>(p: Persisted<T>) {
  return JSON.stringify(p);
}

export function deserialize<T>(raw: string, expectedVersion: number): Persisted<T> | null {
  try {
    const p = JSON.parse(raw) as Persisted<T>;
    if (p.version != expectedVersion) return null;
    return p;
  } catch {
    return null;
  }
}
