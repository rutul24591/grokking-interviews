function detectPipelineFailure(state) {
  const blockers = [];

  if (state.prodSmokeFailed && !state.autoRollbackReady) blockers.push("prod-failure-without-rollback");
  if (state.stageEvidenceMissing) blockers.push("incident-lacks-release-evidence");
  if (state.rebuiltInProd) blockers.push("production-artifact-drift");
  if (state.flakyGateRetriedToGreen) blockers.push("false-confidence-from-retries");

  return { id: state.id, healthy: blockers.length === 0, blockers };
}

const states = [
  { id: "healthy", prodSmokeFailed: false, autoRollbackReady: true, stageEvidenceMissing: false, rebuiltInProd: false, flakyGateRetriedToGreen: false },
  { id: "broken", prodSmokeFailed: true, autoRollbackReady: false, stageEvidenceMissing: true, rebuiltInProd: true, flakyGateRetriedToGreen: true }
];

console.log(states.map(detectPipelineFailure));
