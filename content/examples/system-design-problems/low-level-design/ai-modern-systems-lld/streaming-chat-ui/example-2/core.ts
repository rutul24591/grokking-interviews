export type streamingChatUiSignal = {
  tokenLatencyMs: number;
  citationCoverage: number;
  retrievalConfidence: number;
  policySeverity: number;
};

export type streamingChatUiEvent = {
  id: string;
  topic: "streaming-chat-ui";
  actorId: string;
  sequence: number;
  receivedAtMs: number;
  expectedVersion: number;
  currentVersion: number;
  payloadSize: number;
  signal: streamingChatUiSignal;
};

export type streamingChatUiDecision = {
  accepted: boolean;
  action: "abort-stale-stream" | "show-citation-warning" | "fallback-to-keyword-search" | "commit";
  nextVersion: number;
  reasons: string[];
  audit: string[];
};

const topicInvariant = "Every answer must carry traceable source coverage and stop streaming when the request is superseded.";

export function evaluateStreamingChatUiEvent(event: streamingChatUiEvent): streamingChatUiDecision {
  const reasons: string[] = [];

  if (event.expectedVersion !== event.currentVersion) reasons.push("version-mismatch");
  if (event.sequence <= 0) reasons.push("invalid-sequence");
  if (event.payloadSize > 256_000) reasons.push("payload-too-large-for-interactive-path");
  if (event.signal.tokenLatencyMs > 2_000) reasons.push("tokenLatencyMs-outside-slo");
  if (event.signal.retrievalConfidence > 0.2) reasons.push("retrievalConfidence-requires-guardrail");

  let action: streamingChatUiDecision["action"] = "commit";
  if (reasons.includes("version-mismatch")) action = "abort-stale-stream";
  else if (reasons.includes("payload-too-large-for-interactive-path")) action = "show-citation-warning";
  else if (reasons.some((reason) => reason.endsWith("requires-guardrail"))) action = "fallback-to-keyword-search";

  return {
    accepted: reasons.length === 0,
    action,
    nextVersion: reasons.length === 0 ? event.currentVersion + 1 : event.currentVersion,
    reasons,
    audit: [
      "topic:Streaming Chat UI",
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

export function runStreamingChatUiContractScenario() {
  const base = Date.parse("2026-05-29T09:00:00.000Z");
  const accepted = evaluateStreamingChatUiEvent({
    id: "streaming-chat-ui-evt-1",
    topic: "streaming-chat-ui",
    actorId: "user-42",
    sequence: 7,
    receivedAtMs: base,
    expectedVersion: 12,
    currentVersion: 12,
    payloadSize: 18_500,
    signal: { tokenLatencyMs: 180, citationCoverage: 0, retrievalConfidence: 0.01, policySeverity: 1 },
  });

  const guarded = evaluateStreamingChatUiEvent({
    id: "streaming-chat-ui-evt-late",
    topic: "streaming-chat-ui",
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
