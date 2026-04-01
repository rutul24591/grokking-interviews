function budgetFailures(metrics) {
  return metrics
    .filter((metric) => metric.value > metric.budget)
    .map((metric) => ({
      name: metric.name,
      overBudgetBy: Number((metric.value - metric.budget).toFixed(2)),
      severity: metric.value > metric.budget * 1.1 ? "critical" : "warning"
    }));
}

console.log(
  budgetFailures([
    { name: "INP", value: 210, budget: 200 },
    { name: "CLS", value: 0.02, budget: 0.1 },
    { name: "LCP", value: 2.9, budget: 2.5 }
  ])
);
