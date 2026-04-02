function detectHiddenHotspots(summary, queues, alerts) {
  const breachedQueues = queues.filter((queue) => queue.backlog > queue.threshold || queue.oldestItemMinutes > queue.slaMinutes);
  const maskedAlerts = alerts.filter((alert) => alert.dismissed && alert.severity === "high").map((alert) => alert.id);
  return {
    hotspotDetected: summary.globalSlaHealthy && (breachedQueues.length > 0 || maskedAlerts.length > 0),
    breachedQueues: breachedQueues.map((queue) => queue.name),
    maskedAlerts
  };
}

console.log(
  detectHiddenHotspots(
    { globalSlaHealthy: true },
    [{ name: "legal", backlog: 18, threshold: 10, oldestItemMinutes: 130, slaMinutes: 60 }],
    [{ id: "al-9", dismissed: true, severity: "high" }]
  )
);
