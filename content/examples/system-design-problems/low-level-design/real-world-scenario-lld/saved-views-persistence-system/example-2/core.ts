export type savedViewsPersistenceSystemSignal = {
  latencyMs: number;
  staleAgeMs: number;
  conflictCount: number;
  errorRate: number;
};

export type savedViewsPersistenceSystemEvent = {
  id: string;
  topic: "saved-views-persistence-system";
  actorId: string;
  sequence: number;
  receivedAtMs: number;
  expectedVersion: number;
  currentVersion: number;
  payloadSize: number;
  signal: savedViewsPersistenceSystemSignal;
};

export type savedViewsPersistenceSystemDecision = {
  accepted: boolean;
  action: "show-stale-state" | "queue-repair" | "record-audit-event" | "commit";
  nextVersion: number;
  reasons: string[];
  audit: string[];
};

const topicInvariant = "The UI should preserve user intent while exposing stale, failed, or conflicting state clearly.";

export function evaluateSavedViewsPersistenceSystemEvent(event: savedViewsPersistenceSystemEvent): savedViewsPersistenceSystemDecision {
  const reasons: string[] = [];

  if (event.expectedVersion !== event.currentVersion) reasons.push("version-mismatch");
  if (event.sequence <= 0) reasons.push("invalid-sequence");
  if (event.payloadSize > 256_000) reasons.push("payload-too-large-for-interactive-path");
  if (event.signal.latencyMs > 2_000) reasons.push("latencyMs-outside-slo");
  if (event.signal.conflictCount > 0.2) reasons.push("conflictCount-requires-guardrail");

  let action: savedViewsPersistenceSystemDecision["action"] = "commit";
  if (reasons.includes("version-mismatch")) action = "show-stale-state";
  else if (reasons.includes("payload-too-large-for-interactive-path")) action = "queue-repair";
  else if (reasons.some((reason) => reason.endsWith("requires-guardrail"))) action = "record-audit-event";

  return {
    accepted: reasons.length === 0,
    action,
    nextVersion: reasons.length === 0 ? event.currentVersion + 1 : event.currentVersion,
    reasons,
    audit: [
      "topic:Saved Views Persistence System",
      "subcategory:real-world-scenario-lld",
      "entity:product workflow event",
      "state:screen state snapshot",
      "operation:user-visible state transition",
      "invariant:" + topicInvariant,
      "actor:" + event.actorId,
      "event:" + event.id,
    ],
  };
}

export function runSavedViewsPersistenceSystemContractScenario() {
  const base = Date.parse("2026-05-29T09:00:00.000Z");
  const accepted = evaluateSavedViewsPersistenceSystemEvent({
    id: "saved-views-persistence-system-evt-1",
    topic: "saved-views-persistence-system",
    actorId: "user-42",
    sequence: 7,
    receivedAtMs: base,
    expectedVersion: 12,
    currentVersion: 12,
    payloadSize: 18_500,
    signal: { latencyMs: 180, staleAgeMs: 0, conflictCount: 0.01, errorRate: 1 },
  });

  const guarded = evaluateSavedViewsPersistenceSystemEvent({
    id: "saved-views-persistence-system-evt-late",
    topic: "saved-views-persistence-system",
    actorId: "user-42",
    sequence: 8,
    receivedAtMs: base + 4_000,
    expectedVersion: 12,
    currentVersion: 14,
    payloadSize: 310_000,
    signal: { latencyMs: 2_700, staleAgeMs: 3, conflictCount: 0.34, errorRate: 2 },
  });

  return { accepted, guarded };
}
