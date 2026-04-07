function evaluateUnitTestReadiness(module) {
  const actions = [];

  if (!module.pureInputsOnly) actions.push("extract-side-effects-from-unit-scope");
  if (module.branchCoveragePct < 85) actions.push("add-branch-level-assertions");
  if (module.sharedMocks) actions.push("reset-or-localize-mocks");
  if (module.snapshotOnly) actions.push("replace-snapshots-with-behavior-assertions");
  if (module.mutationScorePct < 60) actions.push("add-stronger-defect-killing-assertions");

  const lane = actions.length === 0 ? "ready" : actions.length <= 2 ? "watch" : "block";
  return { id: module.id, lane, actions, ready: actions.length === 0 };
}

const modules = [
  { id: "pricing", pureInputsOnly: true, branchCoveragePct: 92, sharedMocks: false, snapshotOnly: false, mutationScorePct: 81 },
  { id: "ranking", pureInputsOnly: true, branchCoveragePct: 74, sharedMocks: true, snapshotOnly: false, mutationScorePct: 49 },
  { id: "formatter", pureInputsOnly: false, branchCoveragePct: 61, sharedMocks: false, snapshotOnly: true, mutationScorePct: 32 }
];

console.log(modules.map(evaluateUnitTestReadiness));
