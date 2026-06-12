export type RichTextEditorRecoveryInput = {
  operationId: string;
  committedRevision: number;
  observedRevision: number;
  pressure: string;
  retryBudget: number;
};

export type RichTextEditorRecoveryPlan = {
  disposition: "retry" | "degrade" | "manual-review";
  repair: string;
  evidence: string[];
  nextRetryBudget: number;
};

// Recovery is explicit so a UI does not silently corrupt the rich-text transaction log.
export function planRichTextEditorRecovery(
  input: RichTextEditorRecoveryInput,
): RichTextEditorRecoveryPlan {
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
    repair: "sanitize the pasted subtree, normalize schema violations, and resolve the selection bookmark to the nearest valid text position",
    evidence,
    nextRetryBudget: input.retryBudget - 1,
  };
}

export function runRichTextEditorRecoveryScenario() {
  return planRichTextEditorRecovery({
    operationId: "rich-text-editor-edge-42",
    committedRevision: 12,
    observedRevision: 9,
    pressure: "a paste introduced unsupported nested nodes and an invalid selection path",
    retryBudget: 2,
  });
}
