export type CancellationToken = { id: number };

export function createTokenCounter() {
  let current = 0;
  return {
    next(): CancellationToken {
      current += 1;
      return { id: current };
    },
    isLatest(token: CancellationToken): boolean {
      return token.id === current;
    },
  };
}

export function debounce<TArgs extends unknown[]>(
  fn: (...args: TArgs) => void,
  delayMs: number,
) {
  let handle: ReturnType<typeof setTimeout> | null = null;
  return (...args: TArgs) => {
    if (handle) clearTimeout(handle);
    handle = setTimeout(() => fn(...args), delayMs);
  };
}

