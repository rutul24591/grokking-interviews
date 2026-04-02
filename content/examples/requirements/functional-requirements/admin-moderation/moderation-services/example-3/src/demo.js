function detectPolicyDrift(samples) {
  const mismatches = samples.filter((sample) => sample.modelDecision !== sample.humanDecision);
  const rate = mismatches.length / samples.length;
  const severeFamilies = mismatches.filter((sample) => sample.policyFamily === "child-safety" || sample.impact === "high").map((sample) => sample.id);
  return {
    mismatches: mismatches.length,
    rollback: rate > 0.25 || severeFamilies.length > 0,
    severeFamilies
  };
}

console.log(
  detectPolicyDrift([
    { id: "s1", modelDecision: "remove", humanDecision: "remove", policyFamily: "spam", impact: "medium" },
    { id: "s2", modelDecision: "allow", humanDecision: "remove", policyFamily: "child-safety", impact: "high" },
    { id: "s3", modelDecision: "allow", humanDecision: "allow", policyFamily: "spam", impact: "low" },
    { id: "s4", modelDecision: "allow", humanDecision: "remove", policyFamily: "harassment", impact: "high" }
  ])
);
