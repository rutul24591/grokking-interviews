function dedupeAndEscalate(alerts, windowMinutes) {
  const deduped = [];
  const escalations = [];

  for (const alert of alerts) {
    const alreadyCovered = deduped.some((candidate) => candidate.signature === alert.signature && alert.minute - candidate.minute <= windowMinutes);
    if (alreadyCovered) {
      if (alert.severity === "high") escalations.push(alert.id);
      continue;
    }
    deduped.push(alert);
  }

  return {
    delivered: deduped.map((alert) => alert.id),
    escalations
  };
}

console.log(
  dedupeAndEscalate(
    [
      { id: "a1", signature: "queue-stall", minute: 10, severity: "medium" },
      { id: "a2", signature: "queue-stall", minute: 12, severity: "high" },
      { id: "a3", signature: "appeal-backlog", minute: 18, severity: "high" }
    ],
    5
  )
);
