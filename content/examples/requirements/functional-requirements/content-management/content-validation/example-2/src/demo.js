function publishGate(checks) {
  const failing = checks.filter((check) => check.result === "fail");
  const warningRequiresReview = checks.filter((check) => check.result === "warning" && check.policyDriven);
  return {
    publishAllowed: failing.length === 0 && warningRequiresReview.length === 0,
    failingRules: failing.map((check) => check.rule),
    reviewRules: warningRequiresReview.map((check) => check.rule)
  };
}

console.log(publishGate([{ rule: "hero-image", result: "pass", policyDriven: false }, { rule: "restricted-claim-scan", result: "warning", policyDriven: true }]));
