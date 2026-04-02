function dualControlPlan(operations) {
  const approvals = operations.map((operation) => ({
    id: operation.id,
    requiresDualControl: operation.risk === "high" || operation.affectsPii || operation.bulkImpact > 500,
    reason:
      operation.risk === "high"
        ? "high-risk-operation"
        : operation.affectsPii
          ? "pii-impact"
          : operation.bulkImpact > 500
            ? "large-blast-radius"
            : "single-operator-ok"
  }));

  return {
    approvals,
    blocked: approvals.some((entry) => entry.requiresDualControl)
  };
}

console.log(
  dualControlPlan([
    { id: "bulk-suspend", risk: "high", affectsPii: false, bulkImpact: 320 },
    { id: "export-audit", risk: "medium", affectsPii: true, bulkImpact: 25 }
  ])
);
