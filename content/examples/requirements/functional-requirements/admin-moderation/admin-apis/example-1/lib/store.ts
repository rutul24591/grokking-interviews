const adminApiState = {
  operatorRole: "reviewer",
  operations: [
    { id: "op-1", name: "Suspend account", scope: "accounts.write", risk: "high" as const, allowed: false },
    { id: "op-2", name: "Replay webhook", scope: "integrations.write", risk: "medium" as const, allowed: true }
  ],
  lastMessage: "Admin APIs should expose scope and risk so operators understand what is safe to execute."
};

export function snapshot() {
  return structuredClone(adminApiState);
}

export function mutate(type: "promote-role" | "toggle-operation", id?: string) {
  if (type === "promote-role") {
    adminApiState.operatorRole = adminApiState.operatorRole === "reviewer" ? "super-admin" : "reviewer";
    adminApiState.lastMessage = `Changed operator role to ${adminApiState.operatorRole}.`;
    return snapshot();
  }
  if (type === "toggle-operation" && id) {
    adminApiState.operations = adminApiState.operations.map((operation) => operation.id === id ? { ...operation, allowed: !operation.allowed } : operation);
    adminApiState.lastMessage = `Updated access for ${id}.`;
  }
  return snapshot();
}
