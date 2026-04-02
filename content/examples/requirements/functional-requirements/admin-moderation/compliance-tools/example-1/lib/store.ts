const complianceState = {
  region: "EU",
  obligations: [
    { id: "co-1", rule: "Retention review", status: "open" as const, owner: "legal-ops" },
    { id: "co-2", rule: "PII deletion request", status: "reviewing" as const, owner: "privacy-team" }
  ],
  lastMessage: "Compliance tools should connect obligations to explicit owners and resolution state."
};

export function snapshot() {
  return structuredClone(complianceState);
}

export function mutate(id: string) {
  complianceState.obligations = complianceState.obligations.map((entry) => entry.id === id ? { ...entry, status: "resolved" } : entry);
  complianceState.lastMessage = `Resolved ${id}.`;
  return snapshot();
}
