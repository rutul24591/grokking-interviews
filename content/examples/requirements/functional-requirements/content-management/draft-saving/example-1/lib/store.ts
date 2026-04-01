type Snapshot = {
  id: string;
  savedAt: string;
  status: "queued" | "saved" | "conflict";
};

const draftState: {
  body: string;
  syncStatus: "idle" | "saving" | "saved" | "conflict";
  snapshots: Snapshot[];
  lastMessage: string;
} = {
  body: "Initial article draft body with editor notes and unpublished changes.",
  syncStatus: "idle",
  snapshots: [
    { id: "snap-101", savedAt: "09:45 UTC", status: "saved" },
    { id: "snap-102", savedAt: "10:02 UTC", status: "queued" }
  ],
  lastMessage: "Draft saving should absorb frequent edits without losing recoverability or surfacing stale writes as success."
};

export function snapshot() {
  return structuredClone(draftState);
}

export function mutate(type: "edit" | "save" | "conflict") {
  if (type === "edit") {
    draftState.body += " Added another paragraph.";
    draftState.syncStatus = "saving";
    draftState.lastMessage = "Editor changes queued for autosave.";
  }

  if (type === "save") {
    draftState.syncStatus = "saved";
    draftState.snapshots.unshift({ id: `snap-${103 + draftState.snapshots.length}`, savedAt: "10:15 UTC", status: "saved" });
    draftState.lastMessage = "Latest draft persisted and a recoverable snapshot was recorded.";
  }

  if (type === "conflict") {
    draftState.syncStatus = "conflict";
    draftState.snapshots.unshift({ id: `snap-${103 + draftState.snapshots.length}`, savedAt: "10:16 UTC", status: "conflict" });
    draftState.lastMessage = "Server rejected the stale write because a newer revision already exists.";
  }

  return snapshot();
}
