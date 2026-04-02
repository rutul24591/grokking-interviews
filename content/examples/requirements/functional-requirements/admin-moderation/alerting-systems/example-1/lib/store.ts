const alertState = {
  channel: "pager-duty",
  noiseBudget: 12,
  alerts: [
    { id: "al-1", title: "Escalation queue stalled", severity: "high" as const, acknowledged: false },
    { id: "al-2", title: "False-positive spike", severity: "medium" as const, acknowledged: false }
  ],
  lastMessage: "Alerting should distinguish urgent moderator action from noisy background drift."
};

export function snapshot() {
  return structuredClone(alertState);
}

export function mutate(type: "ack" | "tighten-noise", id?: string) {
  if (type === "tighten-noise") {
    alertState.noiseBudget = Math.max(alertState.noiseBudget - 2, 1);
    alertState.lastMessage = `Reduced noise budget to ${alertState.noiseBudget}.`;
    return snapshot();
  }
  if (type === "ack" && id) {
    alertState.alerts = alertState.alerts.map((alert) => alert.id === id ? { ...alert, acknowledged: true } : alert);
    alertState.lastMessage = `Acknowledged ${id}.`;
  }
  return snapshot();
}
