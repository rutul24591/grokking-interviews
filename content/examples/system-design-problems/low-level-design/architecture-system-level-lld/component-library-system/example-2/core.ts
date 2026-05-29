export type componentLibrarySystemSignal = {
  latencyMs: number;
  staleAgeMs: number;
  conflictCount: number;
  errorRate: number;
};

export type componentLibrarySystemEvent = {
  id: string;
  topic: "component-library-system";
  actorId: string;
  sequence: number;
  receivedAtMs: number;
  expectedVersion: number;
  currentVersion: number;
  payloadSize: number;
  signal: componentLibrarySystemSignal;
};

export type componentLibrarySystemDecision = {
  accepted: boolean;
  action: "show-stale-state" | "queue-repair" | "record-audit-event" | "commit";
  nextVersion: number;
  reasons: string[];
  audit: string[];
};

const topicInvariant = "The UI should preserve user intent while exposing stale, failed, or conflicting state clearly.";

export function evaluateComponentLibrarySystemEvent(event: componentLibrarySystemEvent): componentLibrarySystemDecision {
  const reasons: string[] = [];

  if (event.expectedVersion !== event.currentVersion) reasons.push("version-mismatch");
  if (event.sequence <= 0) reasons.push("invalid-sequence");
  if (event.payloadSize > 256_000) reasons.push("payload-too-large-for-interactive-path");
  if (event.signal.latencyMs > 2_000) reasons.push("latencyMs-outside-slo");
  if (event.signal.conflictCount > 0.2) reasons.push("conflictCount-requires-guardrail");

  let action: componentLibrarySystemDecision["action"] = "commit";
  if (reasons.includes("version-mismatch")) action = "show-stale-state";
  else if (reasons.includes("payload-too-large-for-interactive-path")) action = "queue-repair";
  else if (reasons.some((reason) => reason.endsWith("requires-guardrail"))) action = "record-audit-event";

  return {
    accepted: reasons.length === 0,
    action,
    nextVersion: reasons.length === 0 ? event.currentVersion + 1 : event.currentVersion,
    reasons,
    audit: [
      "topic:Component Library System",
      "subcategory:architecture-system-level-lld",
      "entity:product workflow event",
      "state:screen state snapshot",
      "operation:user-visible state transition",
      "invariant:" + topicInvariant,
      "actor:" + event.actorId,
      "event:" + event.id,
    ],
  };
}

export function runComponentLibrarySystemContractScenario() {
  const base = Date.parse("2026-05-29T09:00:00.000Z");
  const accepted = evaluateComponentLibrarySystemEvent({
    id: "component-library-system-evt-1",
    topic: "component-library-system",
    actorId: "user-42",
    sequence: 7,
    receivedAtMs: base,
    expectedVersion: 12,
    currentVersion: 12,
    payloadSize: 18_500,
    signal: { latencyMs: 180, staleAgeMs: 0, conflictCount: 0.01, errorRate: 1 },
  });

  const guarded = evaluateComponentLibrarySystemEvent({
    id: "component-library-system-evt-late",
    topic: "component-library-system",
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
