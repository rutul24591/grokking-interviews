const serviceState = {
  owner: "identity-platform",
  accounts: [
    { id: "svc-17", service: "Provisioning sync", role: "user-admin", status: "active" as const },
    { id: "svc-22", service: "Dormant cleanup", role: "suspension-admin", status: "review" as const }
  ],
  lastMessage: "User-management services should expose service-account ownership and emergency disable controls so admin automation stays bounded."
};

export function snapshot() {
  return structuredClone(serviceState);
}

export function mutate(type: "rotate-owner" | "disable-account", id?: string) {
  if (type === "rotate-owner") {
    serviceState.owner = serviceState.owner === "identity-platform" ? "trust-operations" : "identity-platform";
    serviceState.lastMessage = `Rotated service ownership to ${serviceState.owner}.`;
    return snapshot();
  }

  if (type === "disable-account" && id) {
    serviceState.accounts = serviceState.accounts.map((account) =>
      account.id === id ? { ...account, status: "disabled" as const } : account
    );
    serviceState.lastMessage = `Disabled ${id} while downstream user state is reviewed.`;
  }

  return snapshot();
}
