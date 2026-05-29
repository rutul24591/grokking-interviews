export type promptHistoryVersioningUiSignal = {
  tokenLatencyMs: number;
  citationCoverage: number;
  retrievalConfidence: number;
  policySeverity: number;
};

export type promptHistoryVersioningUiEvent = {
  id: string;
  topic: "prompt-history-versioning-ui";
  actorId: string;
  sequence: number;
  receivedAtMs: number;
  expectedVersion: number;
  currentVersion: number;
  payloadSize: number;
  signal: promptHistoryVersioningUiSignal;
};

export type promptHistoryVersioningUiDecision = {
  accepted: boolean;
  action: "abort-stale-stream" | "show-citation-warning" | "fallback-to-keyword-search" | "commit";
  nextVersion: number;
  reasons: string[];
  audit: string[];
};

const topicInvariant = "Every answer must carry traceable source coverage and stop streaming when the request is superseded.";

export function evaluatePromptHistoryVersioningUiEvent(event: promptHistoryVersioningUiEvent): promptHistoryVersioningUiDecision {
  const reasons: string[] = [];

  if (event.expectedVersion !== event.currentVersion) reasons.push("version-mismatch");
  if (event.sequence <= 0) reasons.push("invalid-sequence");
  if (event.payloadSize > 256_000) reasons.push("payload-too-large-for-interactive-path");
  if (event.signal.tokenLatencyMs > 2_000) reasons.push("tokenLatencyMs-outside-slo");
  if (event.signal.retrievalConfidence > 0.2) reasons.push("retrievalConfidence-requires-guardrail");

  let action: promptHistoryVersioningUiDecision["action"] = "commit";
  if (reasons.includes("version-mismatch")) action = "abort-stale-stream";
  else if (reasons.includes("payload-too-large-for-interactive-path")) action = "show-citation-warning";
  else if (reasons.some((reason) => reason.endsWith("requires-guardrail"))) action = "fallback-to-keyword-search";

  return {
    accepted: reasons.length === 0,
    action,
    nextVersion: reasons.length === 0 ? event.currentVersion + 1 : event.currentVersion,
    reasons,
    audit: [
      "topic:Prompt History Versioning UI",
      "subcategory:ai-modern-systems-lld",
      "entity:query session",
      "state:retrieval context",
      "operation:streamed answer",
      "invariant:" + topicInvariant,
      "actor:" + event.actorId,
      "event:" + event.id,
    ],
  };
}

export function runPromptHistoryVersioningUiContractScenario() {
  const base = Date.parse("2026-05-29T09:00:00.000Z");
  const accepted = evaluatePromptHistoryVersioningUiEvent({
    id: "prompt-history-versioning-ui-evt-1",
    topic: "prompt-history-versioning-ui",
    actorId: "user-42",
    sequence: 7,
    receivedAtMs: base,
    expectedVersion: 12,
    currentVersion: 12,
    payloadSize: 18_500,
    signal: { tokenLatencyMs: 180, citationCoverage: 0, retrievalConfidence: 0.01, policySeverity: 1 },
  });

  const guarded = evaluatePromptHistoryVersioningUiEvent({
    id: "prompt-history-versioning-ui-evt-late",
    topic: "prompt-history-versioning-ui",
    actorId: "user-42",
    sequence: 8,
    receivedAtMs: base + 4_000,
    expectedVersion: 12,
    currentVersion: 14,
    payloadSize: 310_000,
    signal: { tokenLatencyMs: 2_700, citationCoverage: 3, retrievalConfidence: 0.34, policySeverity: 2 },
  });

  return { accepted, guarded };
}
