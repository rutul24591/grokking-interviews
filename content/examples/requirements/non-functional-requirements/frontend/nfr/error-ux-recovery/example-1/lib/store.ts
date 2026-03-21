const counts = new Map<string, number>();

export function reset() {
  counts.clear();
}

export function flaky(key: string): { ok: boolean; attempt: number } {
  const n = (counts.get(key) ?? 0) + 1;
  counts.set(key, n);
  // Fail first two attempts, succeed third+.
  return { ok: n >= 3, attempt: n };
}

