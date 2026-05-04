export function debounce<TArgs extends unknown[]>(fn: (...args: TArgs) => void, delayMs: number) {
  let handle: ReturnType<typeof setTimeout> | null = null;
  return (...args: TArgs) => {
    if (handle) clearTimeout(handle);
    handle = setTimeout(() => fn(...args), delayMs);
  };
}

export function jitterBackoffMs(attempt: number, baseMs = 250, maxMs = 10_000) {
  const exp = Math.min(maxMs, baseMs * 2 ** Math.max(0, attempt - 1));
  const jitter = Math.random() * exp * 0.2;
  return Math.floor(exp + jitter);
}
