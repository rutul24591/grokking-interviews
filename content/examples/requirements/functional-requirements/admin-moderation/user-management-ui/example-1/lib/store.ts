const userManagementUiState = {
  operator: "trust-admin-1",
  users: [
    { id: "usr-401", email: "creator@site.test", tier: "publisher", status: "active" as const },
    { id: "usr-887", email: "appeals@site.test", tier: "community", status: "pending-review" as const }
  ],
  lastMessage: "User-management UIs should surface account state, operator ownership, and direct corrective actions so risky accounts are handled quickly."
};

export function snapshot() {
  return structuredClone(userManagementUiState);
}

export function mutate(type: "rotate-operator" | "suspend-user", id?: string) {
  if (type === "rotate-operator") {
    userManagementUiState.operator = userManagementUiState.operator === "trust-admin-1" ? "trust-admin-2" : "trust-admin-1";
    userManagementUiState.lastMessage = `Rotated operator assignment to ${userManagementUiState.operator}.`;
    return snapshot();
  }

  if (type === "suspend-user" && id) {
    userManagementUiState.users = userManagementUiState.users.map((user) =>
      user.id === id ? { ...user, status: "suspended" as const } : user
    );
    userManagementUiState.lastMessage = `Suspended ${id} pending moderation review.`;
  }

  return snapshot();
}
