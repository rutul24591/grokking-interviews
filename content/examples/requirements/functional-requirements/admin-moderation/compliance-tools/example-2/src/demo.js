function evaluateObligationBacklog(entries) {
  return entries.map((entry) => ({
    id: entry.id,
    overdue: entry.status !== "resolved" && entry.daysUntilDeadline < 0,
    escalate: entry.status !== "resolved" && (entry.daysUntilDeadline < -2 || entry.region === "EU"),
    nextAction: entry.owner ? "notify-owner" : "assign-owner"
  }));
}

console.log(
  evaluateObligationBacklog([
    { id: "co-1", status: "open", daysUntilDeadline: -3, region: "EU", owner: "privacy-team" },
    { id: "co-2", status: "reviewing", daysUntilDeadline: 2, region: "US", owner: "" }
  ])
);
