export type BreakerState = {
  openUntilMs: number;
};

const KEY = "cdn-breaker-state-v1";

export function readBreakerState(nowMs = Date.now()): BreakerState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { openUntilMs: 0 };
    const parsed = JSON.parse(raw) as BreakerState;
    if (!parsed || typeof parsed.openUntilMs !== "number") return { openUntilMs: 0 };
    if (parsed.openUntilMs < nowMs) return { openUntilMs: 0 };
    return parsed;
  } catch {
    return { openUntilMs: 0 };
  }
}

export function openBreaker(durationMs: number) {
  const next = { openUntilMs: Date.now() + durationMs } satisfies BreakerState;
  localStorage.setItem(KEY, JSON.stringify(next));
}

export function closeBreaker() {
  localStorage.removeItem(KEY);
}

