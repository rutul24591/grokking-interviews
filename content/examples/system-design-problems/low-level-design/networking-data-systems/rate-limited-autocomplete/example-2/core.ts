export type RateLimitedAutocompleteExample2Operation = {
  key: string;
  tenantId: string;
  sequence: number;
  startedAtMs: number;
  deadlineMs: number;
  idempotencyKey?: string;
  payloadBytes: number;
};

export type RateLimitedAutocompleteExample2RuntimeState = {
  currentSequence: number;
  status: "idle" | "loading" | "success" | "retrying" | "degraded" | "failed";
  cacheAgeMs: number;
  subscribers: number;
  retryBudget: number;
  lastCommittedKey?: string;
};

export type RateLimitedAutocompleteExample2Decision = {
  action:
    | "start-transport"
    | "reuse-inflight"
    | "serve-cache-and-revalidate"
    | "ignore-stale-response"
    | "schedule-retry"
    | "degrade-visible-state"
    | "commit";
  reasons: string[];
  nextState: RateLimitedAutocompleteExample2RuntimeState;
  telemetry: Record<string, string | number | boolean | undefined>;
};

const topic = "Design a Rate-Limited Autocomplete System";
const invariant = "a slow response for a previous query must not replace newer suggestions";

export function evaluateRateLimitedAutocompleteExample2(
  operation: RateLimitedAutocompleteExample2Operation,
  state: RateLimitedAutocompleteExample2RuntimeState,
  nowMs: number,
): RateLimitedAutocompleteExample2Decision {
  const reasons: string[] = [];
  const expired = nowMs - operation.startedAtMs > operation.deadlineMs;
  const staleSequence = operation.sequence < state.currentSequence;
  const freshCache = state.cacheAgeMs < 10_000;

  if (staleSequence) reasons.push("stale-sequence");
  if (expired) reasons.push("deadline-expired");
  if (operation.payloadBytes > 256_000) reasons.push("payload-too-large-for-interactive-path");
  if (state.subscribers > 1 && !expired) reasons.push("shared-subscribers-can-reuse-work");
  if (freshCache && state.status === "success") reasons.push("fresh-cache-available");
  if (state.retryBudget <= 0 && expired) reasons.push("retry-budget-exhausted");

  let action: RateLimitedAutocompleteExample2Decision["action"] = "start-transport";
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
      focus: "edge",
      key: operation.key,
      tenantId: operation.tenantId,
      action,
      invariant,
      cacheAgeMs: state.cacheAgeMs,
      retryBudget: state.retryBudget,
    },
  };
}

export function runRateLimitedAutocompleteExample2Scenario() {
  const nowMs = Date.parse("2026-05-29T10:00:00.000Z");
  const baseState: RateLimitedAutocompleteExample2RuntimeState = {
    currentSequence: 8,
    status: "loading",
    cacheAgeMs: 120_000,
    subscribers: 2,
    retryBudget: 2,
    lastCommittedKey: "rate-limited-autocomplete:previous",
  };

  const operation: RateLimitedAutocompleteExample2Operation = {
    key: "rate-limited-autocomplete:tenant-acme:resource-42",
    tenantId: "tenant-acme",
    sequence: 7,
    startedAtMs: nowMs - 800,
    deadlineMs: 15_000,
    idempotencyKey: "idem-rate-limited-autocomplete-42",
    payloadBytes: 18_000,
  };

  return evaluateRateLimitedAutocompleteExample2(operation, baseState, nowMs);
}
