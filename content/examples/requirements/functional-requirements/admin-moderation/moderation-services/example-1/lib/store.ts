const serviceState = {
  policyVersion: "policy-v24",
  lanes: [
    { id: "ms-1", name: "Spam automation", mode: "auto" as const, backlog: 12 },
    { id: "ms-2", name: "Child-safety", mode: "review" as const, backlog: 4 }
  ],
  lastMessage: "Moderation services need a visible control plane so operators can roll back policy changes and redirect risky content classes quickly."
};

export function snapshot() {
  return structuredClone(serviceState);
}

export function mutate(type: "roll-policy" | "toggle-lane", id?: string) {
  if (type === "roll-policy") {
    serviceState.policyVersion = serviceState.policyVersion === "policy-v24" ? "policy-v25" : "policy-v24";
    serviceState.lastMessage = `Rolled service policy to ${serviceState.policyVersion}.`;
    return snapshot();
  }
  if (type === "toggle-lane" && id) {
    serviceState.lanes = serviceState.lanes.map((lane) => lane.id === id ? { ...lane, mode: lane.mode === "auto" ? "review" as const : "auto" as const } : lane);
    serviceState.lastMessage = `Changed moderation lane ${id} for controlled rollback.`;
  }
  return snapshot();
}
