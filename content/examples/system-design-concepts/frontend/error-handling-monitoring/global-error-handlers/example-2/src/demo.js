function routeIncident(incident) {
  if (incident.severity === "fatal") {
    return { queue: "pager-duty", dedupeWindowMs: 60_000 };
  }

  return incident.channel === "unhandledrejection"
    ? { queue: "async-error-queue", dedupeWindowMs: 15_000 }
    : { queue: "sync-error-queue", dedupeWindowMs: 5_000 };
}

console.log(routeIncident({ channel: "window.onerror", severity: "error" }));
