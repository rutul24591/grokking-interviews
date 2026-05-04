// Example 3 edge-case checks.

export function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

export function assertUnreachable(x: never): never {
  throw new Error(`unreachable: ${String(x)}`);
}
