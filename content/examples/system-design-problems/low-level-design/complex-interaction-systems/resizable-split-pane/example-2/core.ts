export type resizableSplitPaneSignal = {
  frameCostMs: number;
  focusDrift: number;
  layoutShiftPx: number;
  pointerCancelCount: number;
};

export type resizableSplitPaneEvent = {
  id: string;
  topic: "resizable-split-pane";
  actorId: string;
  sequence: number;
  receivedAtMs: number;
  expectedVersion: number;
  currentVersion: number;
  payloadSize: number;
  signal: resizableSplitPaneSignal;
};

export type resizableSplitPaneDecision = {
  accepted: boolean;
  action: "restore-focus" | "clamp-layout" | "defer-expensive-work" | "commit";
  nextVersion: number;
  reasons: string[];
  audit: string[];
};

const topicInvariant = "Keyboard, pointer, and assistive-technology paths must converge on the same committed state.";

export function evaluateResizableSplitPaneEvent(event: resizableSplitPaneEvent): resizableSplitPaneDecision {
  const reasons: string[] = [];

  if (event.expectedVersion !== event.currentVersion) reasons.push("version-mismatch");
  if (event.sequence <= 0) reasons.push("invalid-sequence");
  if (event.payloadSize > 256_000) reasons.push("payload-too-large-for-interactive-path");
  if (event.signal.frameCostMs > 2_000) reasons.push("frameCostMs-outside-slo");
  if (event.signal.layoutShiftPx > 0.2) reasons.push("layoutShiftPx-requires-guardrail");

  let action: resizableSplitPaneDecision["action"] = "commit";
  if (reasons.includes("version-mismatch")) action = "restore-focus";
  else if (reasons.includes("payload-too-large-for-interactive-path")) action = "clamp-layout";
  else if (reasons.some((reason) => reason.endsWith("requires-guardrail"))) action = "defer-expensive-work";

  return {
    accepted: reasons.length === 0,
    action,
    nextVersion: reasons.length === 0 ? event.currentVersion + 1 : event.currentVersion,
    reasons,
    audit: [
      "topic:Resizable Split Pane",
      "subcategory:complex-interaction-systems",
      "entity:interactive widget event",
      "state:focus and layout state",
      "operation:user interaction commit",
      "invariant:" + topicInvariant,
      "actor:" + event.actorId,
      "event:" + event.id,
    ],
  };
}

export function runResizableSplitPaneContractScenario() {
  const base = Date.parse("2026-05-29T09:00:00.000Z");
  const accepted = evaluateResizableSplitPaneEvent({
    id: "resizable-split-pane-evt-1",
    topic: "resizable-split-pane",
    actorId: "user-42",
    sequence: 7,
    receivedAtMs: base,
    expectedVersion: 12,
    currentVersion: 12,
    payloadSize: 18_500,
    signal: { frameCostMs: 180, focusDrift: 0, layoutShiftPx: 0.01, pointerCancelCount: 1 },
  });

  const guarded = evaluateResizableSplitPaneEvent({
    id: "resizable-split-pane-evt-late",
    topic: "resizable-split-pane",
    actorId: "user-42",
    sequence: 8,
    receivedAtMs: base + 4_000,
    expectedVersion: 12,
    currentVersion: 14,
    payloadSize: 310_000,
    signal: { frameCostMs: 2_700, focusDrift: 3, layoutShiftPx: 0.34, pointerCancelCount: 2 },
  });

  return { accepted, guarded };
}
