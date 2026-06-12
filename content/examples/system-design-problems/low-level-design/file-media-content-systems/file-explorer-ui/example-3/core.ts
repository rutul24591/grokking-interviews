export type FileExplorerUiRecoveryInput = {
  operationId: string;
  committedRevision: number;
  observedRevision: number;
  pressure: string;
  retryBudget: number;
};

export type FileExplorerUiRecoveryPlan = {
  disposition: "retry" | "degrade" | "manual-review";
  repair: string;
  evidence: string[];
  nextRetryBudget: number;
};

// Recovery is explicit so a UI does not silently corrupt the directory projection.
export function planFileExplorerUiRecovery(
  input: FileExplorerUiRecoveryInput,
): FileExplorerUiRecoveryPlan {
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
    repair: "restore the last committed tree, replay the permitted move against the new revision, and preserve expansion state",
    evidence,
    nextRetryBudget: input.retryBudget - 1,
  };
}

export function runFileExplorerUiRecoveryScenario() {
  return planFileExplorerUiRecovery({
    operationId: "file-explorer-ui-edge-42",
    committedRevision: 12,
    observedRevision: 9,
    pressure: "an optimistic move conflicted with a newer server tree revision",
    retryBudget: 2,
  });
}
