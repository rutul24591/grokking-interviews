function routeAlerts(alerts) {
  return alerts.map((alert) => {
    if (alert.severity === "high") return { id: alert.id, channel: "pager-duty", ackMinutes: 5, suppressible: false };
    if (alert.subsystem === "compliance") return { id: alert.id, channel: "legal-slack", ackMinutes: 15, suppressible: false };
    return { id: alert.id, channel: "ops-slack", ackMinutes: 30, suppressible: true };
  });
}

console.log(
  routeAlerts([
    { id: "queue-stall", severity: "medium", subsystem: "compliance" },
    { id: "safety-breach", severity: "high", subsystem: "moderation" }
  ])
);
