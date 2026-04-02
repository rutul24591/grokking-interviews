const dashboardState = {
  activePanel: "overview" as "overview" | "queues" | "alerts",
  metrics: [
    { id: "m1", label: "Open queues", value: 12, trend: "up" as const },
    { id: "m2", label: "SLA breaches", value: 2, trend: "flat" as const },
    { id: "m3", label: "Escalations today", value: 7, trend: "down" as const },
    { id: "m4", label: "False positives", value: 3, trend: "up" as const }
  ],
  queues: [
    { id: "q1", name: "safety", backlog: 6, oldestMinutes: 22, staffed: "on-call duo" },
    { id: "q2", name: "appeals", backlog: 14, oldestMinutes: 96, staffed: "single reviewer" }
  ],
  alerts: [
    { id: "a1", title: "Appeal queue SLA at risk", severity: "high" as const, acknowledged: false },
    { id: "a2", title: "Spam model false positives rising", severity: "medium" as const, acknowledged: true }
  ],
  lastMessage: "Admin dashboards should summarize workload without forcing operators to drill into every subsystem."
};

export function snapshot() {
  return structuredClone(dashboardState);
}

export function mutate(activePanel: "overview" | "queues" | "alerts") {
  dashboardState.activePanel = activePanel;
  dashboardState.lastMessage = `Switched dashboard panel to ${activePanel}.`;
  return snapshot();
}
