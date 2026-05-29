const assert = require("node:assert/strict");

const topic = "Ads Delivery And Targeting UI";
const invariants = [
  "privacy-safe targeting",
  "creative policy approval",
  "budget pacing",
  "frequency cap",
  "serving snapshot version"
];
const signals = [
  "audienceSize",
  "pacingDriftPct",
  "frequencyCapPressure",
  "policyBlockRate",
  "eligibleInventoryPct"
];

function evaluateMonetizationRisk(input) {
  const moneyRisk = input.moneyDeltaCents / 10_000;
  const privacyRisk = input.smallCohort ? 35 : 0;
  const policyRisk = input.policyState !== "approved" ? 25 : 0;
  const freshnessRisk = input.freshnessLagMs / 1000;
  const riskScore = Math.round(moneyRisk + privacyRisk + policyRisk + freshnessRisk + input.userImpactPct * 40);

  return {
    topic,
    decision: riskScore >= 80 ? "block" : riskScore >= 35 ? "review" : "ship",
    riskScore,
    requiredInvariants: invariants,
    requiredSignals: signals,
  };
}

const safe = evaluateMonetizationRisk({
  moneyDeltaCents: 500,
  smallCohort: false,
  policyState: "approved",
  freshnessLagMs: 300,
  userImpactPct: 0.02,
});

const unsafe = evaluateMonetizationRisk({
  moneyDeltaCents: 400000,
  smallCohort: true,
  policyState: "pending",
  freshnessLagMs: 20000,
  userImpactPct: 0.9,
});

assert.equal(safe.decision, "ship");
assert.equal(unsafe.decision, "block");
assert.ok(unsafe.requiredInvariants.length >= 5);
assert.ok(unsafe.requiredSignals.includes(signals[0]));

console.log("OK: monetization example-1 passed for " + topic);
