export function createReplayStore({ dedupeWindowMs = 5 * 60_000 } = {}) {
  const seen = new Map();

  return {
    apply({ idempotencyKey, nowMs, effect }) {
      const existing = seen.get(idempotencyKey);
      if (existing && nowMs - existing.completedAtMs <= dedupeWindowMs) {
        return {
          status: "deduped",
          result: existing.result,
          firstAppliedAtMs: existing.completedAtMs
        };
      }

      const result = effect();
      seen.set(idempotencyKey, { completedAtMs: nowMs, result });
      return { status: "applied", result, firstAppliedAtMs: nowMs };
    },
    forceExpire(idempotencyKey, completedAtMs) {
      const entry = seen.get(idempotencyKey);
      if (!entry) return;
      seen.set(idempotencyKey, { ...entry, completedAtMs });
    },
    snapshot() {
      return Array.from(seen.entries()).map(([idempotencyKey, value]) => ({
        idempotencyKey,
        completedAtMs: value.completedAtMs,
        result: value.result
      }));
    }
  };
}
