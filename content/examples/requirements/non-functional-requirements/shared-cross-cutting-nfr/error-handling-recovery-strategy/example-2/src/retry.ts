export function delayMs(base: number, attempt: number, max: number, jitterPct: number) {
  const exp = Math.min(max, base * 2 ** (attempt - 1));
  const jitter = exp * jitterPct * Math.random();
  return Math.floor(exp + jitter);
}

