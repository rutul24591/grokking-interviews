const auditState = {
  filter: "all" as "all" | "high",
  entries: [
    { id: "au-1", actor: "admin-21", action: "suspend-account", target: "user-449", severity: "high" as const },
    { id: "au-2", actor: "reviewer-9", action: "resolve-report", target: "case-118", severity: "low" as const }
  ],
  lastMessage: "Audit logs should preserve who did what, to which target, and with what severity."
};

export function snapshot() {
  return structuredClone({
    ...auditState,
    entries: auditState.filter === "high" ? auditState.entries.filter((entry) => entry.severity === "high") : auditState.entries
  });
}

export function mutate(filter: "all" | "high") {
  auditState.filter = filter;
  auditState.lastMessage = `Showing ${filter === "high" ? "high severity" : "all"} audit entries.`;
  return snapshot();
}
