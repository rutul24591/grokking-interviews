export type liveCursorPresenceSystemSignal = {
  eventLagMs: number;
  duplicateCount: number;
  presenceAgeMs: number;
  reconnectAttempt: number;
};

export type liveCursorPresenceSystemEvent = {
  id: string;
  topic: "live-cursor-presence-system";
  actorId: string;
  sequence: number;
  receivedAtMs: number;
  expectedVersion: number;
  currentVersion: number;
  payloadSize: number;
  signal: liveCursorPresenceSystemSignal;
};

export type liveCursorPresenceSystemDecision = {
  accepted: boolean;
  action: "dedupe-event" | "replay-missed-events" | "compact-presence" | "commit";
  nextVersion: number;
  reasons: string[];
  audit: string[];
};

const topicInvariant = "Late, duplicate, and out-of-order events must not corrupt local room state.";

export function evaluateLiveCursorPresenceSystemEvent(event: liveCursorPresenceSystemEvent): liveCursorPresenceSystemDecision {
  const reasons: string[] = [];

  if (event.expectedVersion !== event.currentVersion) reasons.push("version-mismatch");
  if (event.sequence <= 0) reasons.push("invalid-sequence");
  if (event.payloadSize > 256_000) reasons.push("payload-too-large-for-interactive-path");
  if (event.signal.eventLagMs > 2_000) reasons.push("eventLagMs-outside-slo");
  if (event.signal.presenceAgeMs > 0.2) reasons.push("presenceAgeMs-requires-guardrail");

  let action: liveCursorPresenceSystemDecision["action"] = "commit";
  if (reasons.includes("version-mismatch")) action = "dedupe-event";
  else if (reasons.includes("payload-too-large-for-interactive-path")) action = "replay-missed-events";
  else if (reasons.some((reason) => reason.endsWith("requires-guardrail"))) action = "compact-presence";

  return {
    accepted: reasons.length === 0,
    action,
    nextVersion: reasons.length === 0 ? event.currentVersion + 1 : event.currentVersion,
    reasons,
    audit: [
      "topic:Live Cursor Presence System",
      "subcategory:communication-collaboration",
      "entity:collaboration event",
      "state:room presence snapshot",
      "operation:realtime fanout",
      "invariant:" + topicInvariant,
      "actor:" + event.actorId,
      "event:" + event.id,
    ],
  };
}

export function runLiveCursorPresenceSystemContractScenario() {
  const base = Date.parse("2026-05-29T09:00:00.000Z");
  const accepted = evaluateLiveCursorPresenceSystemEvent({
    id: "live-cursor-presence-system-evt-1",
    topic: "live-cursor-presence-system",
    actorId: "user-42",
    sequence: 7,
    receivedAtMs: base,
    expectedVersion: 12,
    currentVersion: 12,
    payloadSize: 18_500,
    signal: { eventLagMs: 180, duplicateCount: 0, presenceAgeMs: 0.01, reconnectAttempt: 1 },
  });

  const guarded = evaluateLiveCursorPresenceSystemEvent({
    id: "live-cursor-presence-system-evt-late",
    topic: "live-cursor-presence-system",
    actorId: "user-42",
    sequence: 8,
    receivedAtMs: base + 4_000,
    expectedVersion: 12,
    currentVersion: 14,
    payloadSize: 310_000,
    signal: { eventLagMs: 2_700, duplicateCount: 3, presenceAgeMs: 0.34, reconnectAttempt: 2 },
  });

  return { accepted, guarded };
}
