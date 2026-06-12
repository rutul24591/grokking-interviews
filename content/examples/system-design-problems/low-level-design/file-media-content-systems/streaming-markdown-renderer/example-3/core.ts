export type StreamingMarkdownRendererRecoveryInput = {
  operationId: string;
  committedRevision: number;
  observedRevision: number;
  pressure: string;
  retryBudget: number;
};

export type StreamingMarkdownRendererRecoveryPlan = {
  disposition: "retry" | "degrade" | "manual-review";
  repair: string;
  evidence: string[];
  nextRetryBudget: number;
};

// Recovery is explicit so a UI does not silently corrupt the streaming markdown projection.
export function planStreamingMarkdownRendererRecovery(
  input: StreamingMarkdownRendererRecoveryInput,
): StreamingMarkdownRendererRecoveryPlan {
  const evidence = [
    `operation:${input.operationId}`,
    `committed:${input.committedRevision}`,
    `observed:${input.observedRevision}`,
    `pressure:${input.pressure}`,
  ];
  if (input.retryBudget <= 0) {
    return {
      disposition: "manual-review",
      repair: "preserve the last committed projection and surface an actionable recovery state",
      evidence,
      nextRetryBudget: 0,
    };
  }
  return {
    disposition: input.observedRevision < input.committedRevision ? "degrade" : "retry",
    repair: "retain the incomplete suffix, sanitize only the complete parsed prefix, and append the block after its closing fence arrives",
    evidence,
    nextRetryBudget: input.retryBudget - 1,
  };
}

export function runStreamingMarkdownRendererRecoveryScenario() {
  return planStreamingMarkdownRendererRecovery({
    operationId: "streaming-markdown-renderer-edge-42",
    committedRevision: 12,
    observedRevision: 9,
    pressure: "a network chunk ended inside a fenced code block containing raw HTML",
    retryBudget: 2,
  });
}
