export function computeBackoffMs(params) {
  const attempt = Math.max(0, params.attempt);
  const base = Math.max(1, params.baseMs);
  const cap = Math.max(base, params.capMs);
  const raw = Math.min(cap, base * 2 ** attempt);

  const jitter = params.jitter ?? 0.2;
  const delta = raw * jitter;
  const withJitter = raw + (Math.random() * 2 - 1) * delta;
  return Math.max(0, Math.round(withJitter));
}

