export type CodeEditorComponentRecoveryInput = {
  operationId: string;
  committedRevision: number;
  observedRevision: number;
  pressure: string;
  retryBudget: number;
};

export type CodeEditorComponentRecoveryPlan = {
  disposition: "retry" | "degrade" | "manual-review";
  repair: string;
  evidence: string[];
  nextRetryBudget: number;
};

// Recovery is explicit so a UI does not silently corrupt the editor document.
export function planCodeEditorComponentRecovery(
  input: CodeEditorComponentRecoveryInput,
): CodeEditorComponentRecoveryPlan {
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
    repair: "discard stale diagnostics and request analysis for the latest model version",
    evidence,
    nextRetryBudget: input.retryBudget - 1,
  };
}

export function runCodeEditorComponentRecoveryScenario() {
  return planCodeEditorComponentRecovery({
    operationId: "code-editor-component-edge-42",
    committedRevision: 12,
    observedRevision: 9,
    pressure: "language-server diagnostics arrived for a stale document version",
    retryBudget: 2,
  });
}
