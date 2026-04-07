function evaluatePromotionPlan(run) {
  const actions = [];

  if (!run.singleArtifactDigest) actions.push("rebuild-pipeline-around-one-artifact");
  if (run.flakeRatePct > 2) actions.push("stabilize-quality-gate");
  if (!run.prodApprovalPresent) actions.push("restore-final-approval");
  if (run.rollbackArtifactMissing) actions.push("preserve-last-known-good-artifact");

  return {
    id: run.id,
    promote: actions.length === 0,
    actions
  };
}

const runs = [
  { id: "healthy", singleArtifactDigest: true, flakeRatePct: 0, prodApprovalPresent: true, rollbackArtifactMissing: false },
  { id: "flaky", singleArtifactDigest: true, flakeRatePct: 8, prodApprovalPresent: true, rollbackArtifactMissing: false },
  { id: "unsafe", singleArtifactDigest: false, flakeRatePct: 1, prodApprovalPresent: false, rollbackArtifactMissing: true }
];

console.log(runs.map(evaluatePromotionPlan));
