function canAdvance({ currentStep, targetStep, stepStatus }) {
  if (targetStep <= currentStep) return true;
  if (targetStep === 1) return stepStatus.workspace;
  if (targetStep === 2) return stepStatus.workspace && stepStatus.reviewers;
  return false;
}

console.log([
  { currentStep: 0, targetStep: 1, stepStatus: { workspace: true, reviewers: false } },
  { currentStep: 0, targetStep: 2, stepStatus: { workspace: true, reviewers: false } },
  { currentStep: 1, targetStep: 2, stepStatus: { workspace: true, reviewers: true } }
].map(canAdvance));
