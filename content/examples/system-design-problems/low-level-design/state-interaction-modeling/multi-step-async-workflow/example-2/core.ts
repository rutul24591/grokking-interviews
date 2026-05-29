export type multiStepAsyncWorkflowSignal = {
  offlineAgeMs: number;
  conflictCount: number;
  logSize: number;
  lastAckVersion: number;
};

export type multiStepAsyncWorkflowEvent = {
  id: string;
  topic: "multi-step-async-workflow";
  actorId: string;
  sequence: number;
  receivedAtMs: number;
  expectedVersion: number;
  currentVersion: number;
  payloadSize: number;
  signal: multiStepAsyncWorkflowSignal;
};

export type multiStepAsyncWorkflowDecision = {
  accepted: boolean;
  action: "replay-local-log" | "surface-conflict" | "compact-acknowledged-ops" | "commit";
  nextVersion: number;
  reasons: string[];
  audit: string[];
};

const topicInvariant = "Local state must survive reloads and converge after reconnect without losing user intent.";

export function evaluateMultiStepAsyncWorkflowEvent(event: multiStepAsyncWorkflowEvent): multiStepAsyncWorkflowDecision {
  const reasons: string[] = [];

  if (event.expectedVersion !== event.currentVersion) reasons.push("version-mismatch");
  if (event.sequence <= 0) reasons.push("invalid-sequence");
  if (event.payloadSize > 256_000) reasons.push("payload-too-large-for-interactive-path");
  if (event.signal.offlineAgeMs > 2_000) reasons.push("offlineAgeMs-outside-slo");
  if (event.signal.logSize > 0.2) reasons.push("logSize-requires-guardrail");

  let action: multiStepAsyncWorkflowDecision["action"] = "commit";
  if (reasons.includes("version-mismatch")) action = "replay-local-log";
  else if (reasons.includes("payload-too-large-for-interactive-path")) action = "surface-conflict";
  else if (reasons.some((reason) => reason.endsWith("requires-guardrail"))) action = "compact-acknowledged-ops";

  return {
    accepted: reasons.length === 0,
    action,
    nextVersion: reasons.length === 0 ? event.currentVersion + 1 : event.currentVersion,
    reasons,
    audit: [
      "topic:Multi Step Async Workflow",
      "subcategory:state-interaction-modeling",
      "entity:local mutation",
      "state:client state log",
      "operation:sync reconciliation",
      "invariant:" + topicInvariant,
      "actor:" + event.actorId,
      "event:" + event.id,
    ],
  };
}

export function runMultiStepAsyncWorkflowContractScenario() {
  const base = Date.parse("2026-05-29T09:00:00.000Z");
  const accepted = evaluateMultiStepAsyncWorkflowEvent({
    id: "multi-step-async-workflow-evt-1",
    topic: "multi-step-async-workflow",
    actorId: "user-42",
    sequence: 7,
    receivedAtMs: base,
    expectedVersion: 12,
    currentVersion: 12,
    payloadSize: 18_500,
    signal: { offlineAgeMs: 180, conflictCount: 0, logSize: 0.01, lastAckVersion: 1 },
  });

  const guarded = evaluateMultiStepAsyncWorkflowEvent({
    id: "multi-step-async-workflow-evt-late",
    topic: "multi-step-async-workflow",
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
