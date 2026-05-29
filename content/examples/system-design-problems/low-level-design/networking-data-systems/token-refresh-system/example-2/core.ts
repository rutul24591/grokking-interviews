export type tokenRefreshSystemSignal = {
  attempt: number;
  deadlineMs: number;
  cacheAgeMs: number;
  conflictCount: number;
};

export type tokenRefreshSystemEvent = {
  id: string;
  topic: "token-refresh-system";
  actorId: string;
  sequence: number;
  receivedAtMs: number;
  expectedVersion: number;
  currentVersion: number;
  payloadSize: number;
  signal: tokenRefreshSystemSignal;
};

export type tokenRefreshSystemDecision = {
  accepted: boolean;
  action: "reuse-inflight-request" | "rollback-optimistic-update" | "retry-with-jitter" | "commit";
  nextVersion: number;
  reasons: string[];
  audit: string[];
};

const topicInvariant = "Retries, dedupe, and optimistic updates must be idempotent and observable.";

export function evaluateTokenRefreshSystemEvent(event: tokenRefreshSystemEvent): tokenRefreshSystemDecision {
  const reasons: string[] = [];

  if (event.expectedVersion !== event.currentVersion) reasons.push("version-mismatch");
  if (event.sequence <= 0) reasons.push("invalid-sequence");
  if (event.payloadSize > 256_000) reasons.push("payload-too-large-for-interactive-path");
  if (event.signal.attempt > 2_000) reasons.push("attempt-outside-slo");
  if (event.signal.cacheAgeMs > 0.2) reasons.push("cacheAgeMs-requires-guardrail");

  let action: tokenRefreshSystemDecision["action"] = "commit";
  if (reasons.includes("version-mismatch")) action = "reuse-inflight-request";
  else if (reasons.includes("payload-too-large-for-interactive-path")) action = "rollback-optimistic-update";
  else if (reasons.some((reason) => reason.endsWith("requires-guardrail"))) action = "retry-with-jitter";

  return {
    accepted: reasons.length === 0,
    action,
    nextVersion: reasons.length === 0 ? event.currentVersion + 1 : event.currentVersion,
    reasons,
    audit: [
      "topic:Token Refresh System",
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

export function runTokenRefreshSystemContractScenario() {
  const base = Date.parse("2026-05-29T09:00:00.000Z");
  const accepted = evaluateTokenRefreshSystemEvent({
    id: "token-refresh-system-evt-1",
    topic: "token-refresh-system",
    actorId: "user-42",
    sequence: 7,
    receivedAtMs: base,
    expectedVersion: 12,
    currentVersion: 12,
    payloadSize: 18_500,
    signal: { attempt: 180, deadlineMs: 0, cacheAgeMs: 0.01, conflictCount: 1 },
  });

  const guarded = evaluateTokenRefreshSystemEvent({
    id: "token-refresh-system-evt-late",
    topic: "token-refresh-system",
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
