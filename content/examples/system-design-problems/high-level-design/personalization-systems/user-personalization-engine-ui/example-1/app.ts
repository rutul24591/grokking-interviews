const assert = require("node:assert/strict");

const topic = "User Personalization Engine UI";
const invariants = [
  "consent-aware profile",
  "feature freshness",
  "exposure logging",
  "guardrail rollout",
  "explainable decision"
];
const signals = [
  "featureAgeMs",
  "consentMismatchCount",
  "exposureLogGap",
  "fairnessDeltaPct",
  "fallbackRate"
];

function evaluatePersonalizationLaunch(input) {
  const riskScore = Math.round(
    input.featureAgeMs / 1000 +
      input.guardrailRegressionPct * 8 +
      input.privacyIncidents * 40 +
      input.unexplainedDecisionRate * 100 +
      (input.rollbackReady ? 0 : 25),
  );

  return {
    topic,
    decision: riskScore >= 80 ? "block" : riskScore >= 30 ? "canary" : "ship",
    riskScore,
    invariants,
    signals,
  };
}

const safe = evaluatePersonalizationLaunch({
  featureAgeMs: 300,
  guardrailRegressionPct: 0.2,
  privacyIncidents: 0,
  unexplainedDecisionRate: 0.01,
  rollbackReady: true,
});

const unsafe = evaluatePersonalizationLaunch({
  featureAgeMs: 45000,
  guardrailRegressionPct: 8,
  privacyIncidents: 1,
  unexplainedDecisionRate: 0.25,
  rollbackReady: false,
});

assert.equal(safe.decision, "ship");
assert.equal(unsafe.decision, "block");
assert.ok(unsafe.invariants.length >= 5);
assert.ok(unsafe.signals.includes(signals[0]));

console.log("OK: personalization example-1 passed for " + topic);
