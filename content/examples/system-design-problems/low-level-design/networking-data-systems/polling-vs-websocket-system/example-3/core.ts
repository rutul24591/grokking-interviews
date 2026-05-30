export type PollingVsWebsocketSystemExample3Operation = {
  key: string;
  tenantId: string;
  sequence: number;
  startedAtMs: number;
  deadlineMs: number;
  idempotencyKey?: string;
  payloadBytes: number;
};

export type PollingVsWebsocketSystemExample3RuntimeState = {
  currentSequence: number;
  status: "idle" | "loading" | "success" | "retrying" | "degraded" | "failed";
  cacheAgeMs: number;
  subscribers: number;
  retryBudget: number;
  lastCommittedKey?: string;
};

export type PollingVsWebsocketSystemExample3Decision = {
  action:
    | "start-transport"
    | "reuse-inflight"
    | "serve-cache-and-revalidate"
    | "ignore-stale-response"
    | "schedule-retry"
    | "degrade-visible-state"
    | "commit";
  reasons: string[];
  nextState: PollingVsWebsocketSystemExample3RuntimeState;
  telemetry: Record<string, string | number | boolean | undefined>;
};

const topic = "Design a Polling vs WebSocket System";
const invariant = "client must detect sequence gaps and resync from a snapshot before applying newer deltas";

export function evaluatePollingVsWebsocketSystemExample3(
  operation: PollingVsWebsocketSystemExample3Operation,
  state: PollingVsWebsocketSystemExample3RuntimeState,
  nowMs: number,
): PollingVsWebsocketSystemExample3Decision {
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

  let action: PollingVsWebsocketSystemExample3Decision["action"] = "start-transport";
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

export function runPollingVsWebsocketSystemExample3Scenario() {
  const nowMs = Date.parse("2026-05-29T10:00:00.000Z");
  const baseState: PollingVsWebsocketSystemExample3RuntimeState = {
    currentSequence: 8,
    status: "success",
    cacheAgeMs: 2_000,
    subscribers: 3,
    retryBudget: 0,
    lastCommittedKey: "polling-vs-websocket-system:previous",
  };

  const operation: PollingVsWebsocketSystemExample3Operation = {
    key: "polling-vs-websocket-system:tenant-acme:resource-42",
    tenantId: "tenant-acme",
    sequence: 9,
    startedAtMs: nowMs - 40_000,
    deadlineMs: 15_000,
    idempotencyKey: "idem-polling-vs-websocket-system-42",
    payloadBytes: 4_200,
  };

  return evaluatePollingVsWebsocketSystemExample3(operation, baseState, nowMs);
}
