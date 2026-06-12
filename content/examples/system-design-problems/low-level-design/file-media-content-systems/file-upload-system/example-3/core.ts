export type FileUploadSystemRecoveryInput = {
  operationId: string;
  committedRevision: number;
  observedRevision: number;
  pressure: string;
  retryBudget: number;
};

export type FileUploadSystemRecoveryPlan = {
  disposition: "retry" | "degrade" | "manual-review";
  repair: string;
  evidence: string[];
  nextRetryBudget: number;
};

// Recovery is explicit so a UI does not silently corrupt the multipart upload.
export function planFileUploadSystemRecovery(
  input: FileUploadSystemRecoveryInput,
): FileUploadSystemRecoveryPlan {
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
    repair: "treat the server ledger as authoritative, requeue the missing chunk, verify its checksum, and complete idempotently",
    evidence,
    nextRetryBudget: input.retryBudget - 1,
  };
}

export function runFileUploadSystemRecoveryScenario() {
  return planFileUploadSystemRecovery({
    operationId: "file-upload-system-edge-42",
    committedRevision: 12,
    observedRevision: 9,
    pressure: "the resumed server ledger omitted a chunk that the browser previously marked complete",
    retryBudget: 2,
  });
}
