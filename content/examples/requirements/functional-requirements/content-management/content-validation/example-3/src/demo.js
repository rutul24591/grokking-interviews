function validationEdgeCase(check) {
  if (check.policyDriven && check.result === "warning") {
    return { action: "require-human-review", severity: "high", rerunNeeded: false };
  }
  if (check.metadataMissing && check.result === "pass") {
    return { action: "re-run-validator", severity: "medium", rerunNeeded: true };
  }
  if (check.previousRunHash && check.currentRunHash !== check.previousRunHash) {
    return { action: "mark-non-deterministic", severity: "high", rerunNeeded: true };
  }
  return { action: "accept-result", severity: "low", rerunNeeded: false };
}

console.log(validationEdgeCase({ policyDriven: false, metadataMissing: false, result: "pass", previousRunHash: "a1", currentRunHash: "b2" }));
