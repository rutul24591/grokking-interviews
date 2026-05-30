export type CacheInvalidationStrategyExample3Operation = {
  key: string;
  tenantId: string;
  sequence: number;
  startedAtMs: number;
  deadlineMs: number;
  idempotencyKey?: string;
  payloadBytes: number;
};

export type CacheInvalidationStrategyExample3RuntimeState = {
  currentSequence: number;
  status: "idle" | "loading" | "success" | "retrying" | "degraded" | "failed";
  cacheAgeMs: number;
  subscribers: number;
  retryBudget: number;
  lastCommittedKey?: string;
};

export type CacheInvalidationStrategyExample3Decision = {
  action:
    | "start-transport"
    | "reuse-inflight"
    | "serve-cache-and-revalidate"
    | "ignore-stale-response"
    | "schedule-retry"
    | "degrade-visible-state"
    | "commit";
  reasons: string[];
  nextState: CacheInvalidationStrategyExample3RuntimeState;
  telemetry: Record<string, string | number | boolean | undefined>;
};

const topic = "Design a Cache Invalidation Strategy After Mutations";
const invariant = "over-invalidation causes thundering refetches; under-invalidation leaves stale UI";

export function evaluateCacheInvalidationStrategyExample3(
  operation: CacheInvalidationStrategyExample3Operation,
  state: CacheInvalidationStrategyExample3RuntimeState,
  nowMs: number,
): CacheInvalidationStrategyExample3Decision {
  const reasons: string[] = [];
  const expired = nowMs - operation.startedAtMs > operation.deadlineMs;
  const staleSequence = operation.sequence < state.currentSequence;
  const freshCache = state.cacheAgeMs < 5_000;

  if (staleSequence) reasons.push("stale-sequence");
  if (expired) reasons.push("deadline-expired");
  if (operation.payloadBytes > 256_000) reasons.push("payload-too-large-for-interactive-path");
  if (state.subscribers > 1 && !expired) reasons.push("shared-subscribers-can-reuse-work");
  if (freshCache && state.status === "success") reasons.push("fresh-cache-available");
  if (state.retryBudget <= 0 && expired) reasons.push("retry-budget-exhausted");

  let action: CacheInvalidationStrategyExample3Decision["action"] = "start-transport";
  if (staleSequence) action = "ignore-stale-response";
  else if (freshCache) action = "serve-cache-and-revalidate";
  else if (state.subscribers > 1 && state.status === "loading") action = "reuse-inflight";
  else if (expired && state.retryBudget > 0) action = "schedule-retry";
  else if (expired) action = "degrade-visible-state";
  else if (state.status === "loading") action = "commit";

  return {
    action,
    reasons,
    nextState: {
      ...state,
      currentSequence: Math.max(state.currentSequence, operation.sequence),
      status: action === "commit" ? "success" : action === "schedule-retry" ? "retrying" : action === "degrade-visible-state" ? "degraded" : state.status,
      retryBudget: action === "schedule-retry" ? state.retryBudget - 1 : state.retryBudget,
      lastCommittedKey: action === "commit" ? operation.key : state.lastCommittedKey,
    },
    telemetry: {
      topic,
      focus: "recovery",
      key: operation.key,
      tenantId: operation.tenantId,
      action,
      invariant,
      cacheAgeMs: state.cacheAgeMs,
      retryBudget: state.retryBudget,
    },
  };
}

export function runCacheInvalidationStrategyExample3Scenario() {
  const nowMs = Date.parse("2026-05-29T10:00:00.000Z");
  const baseState: CacheInvalidationStrategyExample3RuntimeState = {
    currentSequence: 8,
    status: "success",
    cacheAgeMs: 2_000,
    subscribers: 3,
    retryBudget: 0,
    lastCommittedKey: "cache-invalidation-strategy:previous",
  };

  const operation: CacheInvalidationStrategyExample3Operation = {
    key: "cache-invalidation-strategy:tenant-acme:resource-42",
    tenantId: "tenant-acme",
    sequence: 9,
    startedAtMs: nowMs - 40_000,
    deadlineMs: 15_000,
    idempotencyKey: "idem-cache-invalidation-strategy-42",
    payloadBytes: 4_200,
  };

  return evaluateCacheInvalidationStrategyExample3(operation, baseState, nowMs);
}
