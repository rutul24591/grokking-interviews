const assert = require("node:assert/strict");

const topic = "Maps Based Delivery Tracking Application";
const invariants = [
  "idempotent user action",
  "offline or retry safety",
  "consistent visible state",
  "bounded cache staleness",
  "rollback path"
];
const signals = [
  "p95LatencyMs",
  "queueDepth",
  "cacheAgeMs",
  "conflictCount",
  "conversionDropPct"
];

function buildScenario(input) {
  const riskScore =
    input.latencyMs / 1000 +
    input.stalenessMs / 2000 +
    input.errorRate * 40 +
    input.blastRadius * 15 +
    (input.hasRollback ? 0 : 25);

  return {
    topic,
    riskScore: Math.round(riskScore),
    releaseState: riskScore >= 70 ? "block" : riskScore >= 35 ? "canary" : "ship",
    requiredChecks: invariants,
    telemetry: signals.map((signal) => ({ signal, required: true })),
  };
}

const healthy = buildScenario({
  latencyMs: 180,
  stalenessMs: 400,
  errorRate: 0.002,
  blastRadius: 0.1,
  hasRollback: true,
});

const risky = buildScenario({
  latencyMs: 8000,
  stalenessMs: 30000,
  errorRate: 0.35,
  blastRadius: 1,
  hasRollback: false,
});

assert.equal(healthy.releaseState, "ship");
assert.equal(risky.releaseState, "block");
assert.ok(risky.requiredChecks.length >= 5);
assert.ok(risky.telemetry.some((entry) => entry.required));

console.log("OK: topic-aligned example-1 passed for " + topic);
