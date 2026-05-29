export type colorPickerSignal = {
  invalidFieldCount: number;
  draftAgeMs: number;
  asyncValidationLagMs: number;
  hiddenDirtyFields: number;
};

export type colorPickerEvent = {
  id: string;
  topic: "color-picker";
  actorId: string;
  sequence: number;
  receivedAtMs: number;
  expectedVersion: number;
  currentVersion: number;
  payloadSize: number;
  signal: colorPickerSignal;
};

export type colorPickerDecision = {
  accepted: boolean;
  action: "clear-hidden-fields" | "cancel-stale-validation" | "persist-versioned-draft" | "commit";
  nextVersion: number;
  reasons: string[];
  audit: string[];
};

const topicInvariant = "Hidden, async, and restored fields must not submit stale or schema-invalid values.";

export function evaluateColorPickerEvent(event: colorPickerEvent): colorPickerDecision {
  const reasons: string[] = [];

  if (event.expectedVersion !== event.currentVersion) reasons.push("version-mismatch");
  if (event.sequence <= 0) reasons.push("invalid-sequence");
  if (event.payloadSize > 256_000) reasons.push("payload-too-large-for-interactive-path");
  if (event.signal.invalidFieldCount > 2_000) reasons.push("invalidFieldCount-outside-slo");
  if (event.signal.asyncValidationLagMs > 0.2) reasons.push("asyncValidationLagMs-requires-guardrail");

  let action: colorPickerDecision["action"] = "commit";
  if (reasons.includes("version-mismatch")) action = "clear-hidden-fields";
  else if (reasons.includes("payload-too-large-for-interactive-path")) action = "cancel-stale-validation";
  else if (reasons.some((reason) => reason.endsWith("requires-guardrail"))) action = "persist-versioned-draft";

  return {
    accepted: reasons.length === 0,
    action,
    nextVersion: reasons.length === 0 ? event.currentVersion + 1 : event.currentVersion,
    reasons,
    audit: [
      "topic:Color Picker",
      "subcategory:forms-input-systems",
      "entity:form field change",
      "state:draft validation graph",
      "operation:form commit",
      "invariant:" + topicInvariant,
      "actor:" + event.actorId,
      "event:" + event.id,
    ],
  };
}

export function runColorPickerContractScenario() {
  const base = Date.parse("2026-05-29T09:00:00.000Z");
  const accepted = evaluateColorPickerEvent({
    id: "color-picker-evt-1",
    topic: "color-picker",
    actorId: "user-42",
    sequence: 7,
    receivedAtMs: base,
    expectedVersion: 12,
    currentVersion: 12,
    payloadSize: 18_500,
    signal: { invalidFieldCount: 180, draftAgeMs: 0, asyncValidationLagMs: 0.01, hiddenDirtyFields: 1 },
  });

  const guarded = evaluateColorPickerEvent({
    id: "color-picker-evt-late",
    topic: "color-picker",
    actorId: "user-42",
    sequence: 8,
    receivedAtMs: base + 4_000,
    expectedVersion: 12,
    currentVersion: 14,
    payloadSize: 310_000,
    signal: { invalidFieldCount: 2_700, draftAgeMs: 3, asyncValidationLagMs: 0.34, hiddenDirtyFields: 2 },
  });

  return { accepted, guarded };
}
