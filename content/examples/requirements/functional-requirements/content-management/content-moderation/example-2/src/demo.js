function routeModerationCase(entry) {
  const queue = entry.severity === "high"
    ? "senior-review"
    : entry.policyArea === "legal"
      ? "legal-review"
      : entry.queue;
  const slaMinutes = entry.severity === "high" ? 15 : entry.policyArea === "legal" ? 30 : 120;
  return { queue, slaMinutes, requiresUserActionFreeze: entry.severity === "high" || entry.repeatOffender };
}

console.log(routeModerationCase({ severity: "high", queue: "abuse", policyArea: "safety", repeatOffender: true }));
