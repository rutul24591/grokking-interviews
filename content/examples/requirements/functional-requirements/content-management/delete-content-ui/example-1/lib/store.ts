const deleteState = {
  itemTitle: "Global Search Indexing",
  dependencyCount: 4,
  deletionMode: "archive" as "archive" | "delete",
  confirmed: false,
  lastMessage: "Deletion UIs should explain downstream blast radius before any destructive operation is confirmed."
};

export function snapshot() {
  return structuredClone(deleteState);
}

export function mutate(type: "toggle-mode" | "confirm") {
  if (type === "toggle-mode") {
    deleteState.deletionMode = deleteState.deletionMode === "archive" ? "delete" : "archive";
    deleteState.lastMessage = `Operator switched to ${deleteState.deletionMode} mode to match retention intent.`;
  }

  if (type === "confirm") {
    deleteState.confirmed = true;
    deleteState.lastMessage =
      deleteState.deletionMode === "archive"
        ? "Content moved out of public discovery while preserving recovery options."
        : "Content delete was confirmed after impact review and recovery window checks.";
  }

  return snapshot();
}
