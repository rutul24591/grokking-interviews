export type inlineEditingSystemSignal = {
  rowCount: number;
  cursorDrift: number;
  cacheAgeMs: number;
  renderCostMs: number;
};

export type inlineEditingSystemEvent = {
  id: string;
  topic: "inline-editing-system";
  actorId: string;
  sequence: number;
  receivedAtMs: number;
  expectedVersion: number;
  currentVersion: number;
  payloadSize: number;
  signal: inlineEditingSystemSignal;
};

export type inlineEditingSystemDecision = {
  accepted: boolean;
  action: "preserve-selection" | "rebase-cursor" | "serve-window-cache" | "commit";
  nextVersion: number;
  reasons: string[];
  audit: string[];
};

const topicInvariant = "Viewport updates must preserve stable identity, cursor order, and visible selection across refreshes.";

export function evaluateInlineEditingSystemEvent(event: inlineEditingSystemEvent): inlineEditingSystemDecision {
  const reasons: string[] = [];

  if (event.expectedVersion !== event.currentVersion) reasons.push("version-mismatch");
  if (event.sequence <= 0) reasons.push("invalid-sequence");
  if (event.payloadSize > 256_000) reasons.push("payload-too-large-for-interactive-path");
  if (event.signal.rowCount > 2_000) reasons.push("rowCount-outside-slo");
  if (event.signal.cacheAgeMs > 0.2) reasons.push("cacheAgeMs-requires-guardrail");

  let action: inlineEditingSystemDecision["action"] = "commit";
  if (reasons.includes("version-mismatch")) action = "preserve-selection";
  else if (reasons.includes("payload-too-large-for-interactive-path")) action = "rebase-cursor";
  else if (reasons.some((reason) => reason.endsWith("requires-guardrail"))) action = "serve-window-cache";

  return {
    accepted: reasons.length === 0,
    action,
    nextVersion: reasons.length === 0 ? event.currentVersion + 1 : event.currentVersion,
    reasons,
    audit: [
      "topic:Inline Editing System",
      "subcategory:data-heavy-ui-components",
      "entity:grid query",
      "state:normalized viewport cache",
      "operation:virtualized data update",
      "invariant:" + topicInvariant,
      "actor:" + event.actorId,
      "event:" + event.id,
    ],
  };
}

export function runInlineEditingSystemContractScenario() {
  const base = Date.parse("2026-05-29T09:00:00.000Z");
  const accepted = evaluateInlineEditingSystemEvent({
    id: "inline-editing-system-evt-1",
    topic: "inline-editing-system",
    actorId: "user-42",
    sequence: 7,
    receivedAtMs: base,
    expectedVersion: 12,
    currentVersion: 12,
    payloadSize: 18_500,
    signal: { rowCount: 180, cursorDrift: 0, cacheAgeMs: 0.01, renderCostMs: 1 },
  });

  const guarded = evaluateInlineEditingSystemEvent({
    id: "inline-editing-system-evt-late",
    topic: "inline-editing-system",
    actorId: "user-42",
    sequence: 8,
    receivedAtMs: base + 4_000,
    expectedVersion: 12,
    currentVersion: 14,
    payloadSize: 310_000,
    signal: { rowCount: 2_700, cursorDrift: 3, cacheAgeMs: 0.34, renderCostMs: 2 },
  });

  return { accepted, guarded };
}
