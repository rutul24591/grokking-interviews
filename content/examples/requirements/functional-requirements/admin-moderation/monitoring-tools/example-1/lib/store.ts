const monitoringState = {
  sampleWindow: "15m",
  monitors: [
    { id: "mt-1", metric: "Queue latency", value: "14m", status: "critical" as const, owner: "queue-ops", updatedAt: "2m ago" },
    { id: "mt-2", metric: "Appeal backlog", value: "+18%", status: "warning" as const, owner: "appeals-team", updatedAt: "5m ago" }
  ],
  blindSpots: ["legal-sla-feed"],
  lastMessage: "Monitoring tools should expose current risk, not just raw charts, so moderation operators can prioritize intervention."
};

export function snapshot() {
  return structuredClone(monitoringState);
}

export function mutate(type: "expand-window" | "ack-critical", id?: string) {
  if (type === "expand-window") {
    monitoringState.sampleWindow = monitoringState.sampleWindow === "15m" ? "60m" : "15m";
    monitoringState.lastMessage = `Expanded monitoring window to ${monitoringState.sampleWindow}.`;
    return snapshot();
  }
  if (type === "ack-critical" && id) {
    monitoringState.monitors = monitoringState.monitors.map((monitor) => monitor.id === id ? { ...monitor, status: "warning" as const } : monitor);
    monitoringState.lastMessage = `Acknowledged ${id} and reduced alert severity after triage.`;
  }
  return snapshot();
}
