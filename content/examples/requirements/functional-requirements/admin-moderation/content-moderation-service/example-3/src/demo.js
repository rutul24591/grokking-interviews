function disagreementRisk(cases) {
  const risky = cases
    .filter((entry) => entry.automatedDecision !== entry.humanDecision && (entry.impact === "high" || entry.policyFamily === "child-safety"))
    .map((entry) => entry.id);
  return {
    risky,
    escalate: risky.length > 0,
    freezeModel: risky.length >= 2
  };
}

console.log(
  disagreementRisk([
    { id: "case-1", automatedDecision: "allow", humanDecision: "block", impact: "high", policyFamily: "harassment" },
    { id: "case-2", automatedDecision: "allow", humanDecision: "allow", impact: "medium", policyFamily: "spam" }
  ])
);
