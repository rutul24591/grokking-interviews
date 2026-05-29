export type dataFetchingHookSignal = {
  attempt: number;
  deadlineMs: number;
  cacheAgeMs: number;
  conflictCount: number;
};

export type dataFetchingHookEvent = {
  id: string;
  topic: "data-fetching-hook";
  actorId: string;
  sequence: number;
  receivedAtMs: number;
  expectedVersion: number;
  currentVersion: number;
  payloadSize: number;
  signal: dataFetchingHookSignal;
};

export type dataFetchingHookDecision = {
  accepted: boolean;
  action: "reuse-inflight-request" | "rollback-optimistic-update" | "retry-with-jitter" | "commit";
  nextVersion: number;
  reasons: string[];
  audit: string[];
};

const topicInvariant = "Retries, dedupe, and optimistic updates must be idempotent and observable.";

export function evaluateDataFetchingHookEvent(event: dataFetchingHookEvent): dataFetchingHookDecision {
  const reasons: string[] = [];

  if (event.expectedVersion !== event.currentVersion) reasons.push("version-mismatch");
  if (event.sequence <= 0) reasons.push("invalid-sequence");
  if (event.payloadSize > 256_000) reasons.push("payload-too-large-for-interactive-path");
  if (event.signal.attempt > 2_000) reasons.push("attempt-outside-slo");
  if (event.signal.cacheAgeMs > 0.2) reasons.push("cacheAgeMs-requires-guardrail");

  let action: dataFetchingHookDecision["action"] = "commit";
  if (reasons.includes("version-mismatch")) action = "reuse-inflight-request";
  else if (reasons.includes("payload-too-large-for-interactive-path")) action = "rollback-optimistic-update";
  else if (reasons.some((reason) => reason.endsWith("requires-guardrail"))) action = "retry-with-jitter";

  return {
    accepted: reasons.length === 0,
    action,
    nextVersion: reasons.length === 0 ? event.currentVersion + 1 : event.currentVersion,
    reasons,
    audit: [
      "topic:Data Fetching Hook",
      "subcategory:networking-data-systems",
      "entity:client request",
      "state:cache and in-flight registry",
      "operation:network data transition",
      "invariant:" + topicInvariant,
      "actor:" + event.actorId,
      "event:" + event.id,
    ],
  };
}

export function runDataFetchingHookContractScenario() {
  const base = Date.parse("2026-05-29T09:00:00.000Z");
  const accepted = evaluateDataFetchingHookEvent({
    id: "data-fetching-hook-evt-1",
    topic: "data-fetching-hook",
    actorId: "user-42",
    sequence: 7,
    receivedAtMs: base,
    expectedVersion: 12,
    currentVersion: 12,
    payloadSize: 18_500,
    signal: { attempt: 180, deadlineMs: 0, cacheAgeMs: 0.01, conflictCount: 1 },
  });

  const guarded = evaluateDataFetchingHookEvent({
    id: "data-fetching-hook-evt-late",
    topic: "data-fetching-hook",
    actorId: "user-42",
    sequence: 8,
    receivedAtMs: base + 4_000,
    expectedVersion: 12,
    currentVersion: 14,
    payloadSize: 310_000,
    signal: { attempt: 2_700, deadlineMs: 3, cacheAgeMs: 0.34, conflictCount: 2 },
  });

  return { accepted, guarded };
}
