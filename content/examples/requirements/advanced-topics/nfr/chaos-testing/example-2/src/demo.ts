import { evaluatePlan, type Policy } from "./policy";

const policy: Policy = {
  allowlistedServicesProd: ["checkout-api", "payments-api"],
  maxProdBlastPct: 5,
  maxProdDurationMs: 60_000,
  requiredProdApprovals: ["sre-oncall", "service-owner"],
  allowRegions: ["us-east-1", "us-west-2"],
};

const candidatePlans = [
  {
    idempotencyKey: "exp-20260320-001",
    owner: "payments-platform",
    env: "prod",
    target: { service: "payments-api", region: "us-east-1" },
    durationMs: 45_000,
    blastPct: 3,
    fault: { type: "latency", latencyMs: 250 },
    approvals: ["sre-oncall", "service-owner"],
  },
  {
    idempotencyKey: "exp-20260320-002",
    owner: "payments-platform",
    env: "prod",
    target: { service: "unknown-api", region: "us-east-1" },
    durationMs: 5 * 60_000,
    blastPct: 25,
    fault: { type: "error", status: 503 },
    approvals: ["service-owner"],
  },
];

for (const plan of candidatePlans) {
  const decision = evaluatePlan(plan, policy);
  console.log(JSON.stringify({ plan, decision }, null, 2));
}

