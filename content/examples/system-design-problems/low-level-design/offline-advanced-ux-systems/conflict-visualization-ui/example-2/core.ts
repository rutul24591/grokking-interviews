export type conflictVisualizationUiSignal = {
  offlineAgeMs: number;
  conflictCount: number;
  logSize: number;
  lastAckVersion: number;
};

export type conflictVisualizationUiEvent = {
  id: string;
  topic: "conflict-visualization-ui";
  actorId: string;
  sequence: number;
  receivedAtMs: number;
  expectedVersion: number;
  currentVersion: number;
  payloadSize: number;
  signal: conflictVisualizationUiSignal;
};

export type conflictVisualizationUiDecision = {
  accepted: boolean;
  action: "replay-local-log" | "surface-conflict" | "compact-acknowledged-ops" | "commit";
  nextVersion: number;
  reasons: string[];
  audit: string[];
};

const topicInvariant = "Local state must survive reloads and converge after reconnect without losing user intent.";

export function evaluateConflictVisualizationUiEvent(event: conflictVisualizationUiEvent): conflictVisualizationUiDecision {
  const reasons: string[] = [];

  if (event.expectedVersion !== event.currentVersion) reasons.push("version-mismatch");
  if (event.sequence <= 0) reasons.push("invalid-sequence");
  if (event.payloadSize > 256_000) reasons.push("payload-too-large-for-interactive-path");
  if (event.signal.offlineAgeMs > 2_000) reasons.push("offlineAgeMs-outside-slo");
  if (event.signal.logSize > 0.2) reasons.push("logSize-requires-guardrail");

  let action: conflictVisualizationUiDecision["action"] = "commit";
  if (reasons.includes("version-mismatch")) action = "replay-local-log";
  else if (reasons.includes("payload-too-large-for-interactive-path")) action = "surface-conflict";
  else if (reasons.some((reason) => reason.endsWith("requires-guardrail"))) action = "compact-acknowledged-ops";

  return {
    accepted: reasons.length === 0,
    action,
    nextVersion: reasons.length === 0 ? event.currentVersion + 1 : event.currentVersion,
    reasons,
    audit: [
      "topic:Conflict Visualization UI",
      "subcategory:offline-advanced-ux-systems",
      "entity:local mutation",
      "state:client state log",
      "operation:sync reconciliation",
      "invariant:" + topicInvariant,
      "actor:" + event.actorId,
      "event:" + event.id,
    ],
  };
}

export function runConflictVisualizationUiContractScenario() {
  const base = Date.parse("2026-05-29T09:00:00.000Z");
  const accepted = evaluateConflictVisualizationUiEvent({
    id: "conflict-visualization-ui-evt-1",
    topic: "conflict-visualization-ui",
    actorId: "user-42",
    sequence: 7,
    receivedAtMs: base,
    expectedVersion: 12,
    currentVersion: 12,
    payloadSize: 18_500,
    signal: { offlineAgeMs: 180, conflictCount: 0, logSize: 0.01, lastAckVersion: 1 },
  });

  const guarded = evaluateConflictVisualizationUiEvent({
    id: "conflict-visualization-ui-evt-late",
    topic: "conflict-visualization-ui",
    actorId: "user-42",
    sequence: 8,
    receivedAtMs: base + 4_000,
    expectedVersion: 12,
    currentVersion: 14,
    payloadSize: 310_000,
    signal: { offlineAgeMs: 2_700, conflictCount: 3, logSize: 0.34, lastAckVersion: 2 },
  });

  return { accepted, guarded };
}
