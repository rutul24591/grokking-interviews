function chooseAlertSeverity(metrics) {
  return metrics.map((metric) => ({
    metric: metric.name,
    severity:
      metric.value >= metric.criticalThreshold
        ? "critical"
        : metric.value >= metric.warningThreshold
          ? "warning"
          : "healthy",
    pageImmediately: metric.value >= metric.criticalThreshold && metric.customerImpact
  }));
}

console.log(
  chooseAlertSeverity([
    { name: "queue-latency", value: 17, warningThreshold: 8, criticalThreshold: 15, customerImpact: true },
    { name: "appeal-backlog", value: 7, warningThreshold: 8, criticalThreshold: 15, customerImpact: false }
  ])
);
