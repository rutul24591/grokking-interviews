const storageState = {
  objects: [
    { id: "o-1", key: "articles/content-preview/hero.png", storageClass: "standard" as const, retentionDays: 365, encrypted: true, restoreEta: "instant" },
    { id: "o-2", key: "drafts/archive/2025-11-export.zip", storageClass: "archive" as const, retentionDays: 30, encrypted: true, restoreEta: "4 hours" }
  ],
  encrypted: true,
  complianceBlocked: false,
  lastMessage: "Object storage choices should make lifecycle, cost, recovery behavior, and encryption policy explicit."
};

export function snapshot() {
  return structuredClone(storageState);
}

export function mutate(type: "promote" | "archive") {
  if (type === "promote") {
    storageState.objects[1].storageClass = "standard";
    storageState.objects[1].restoreEta = "instant";
    storageState.lastMessage = "Promoted an archived object back to standard storage for immediate editorial access.";
  }

  if (type === "archive") {
    storageState.objects[0].storageClass = "archive";
    storageState.objects[0].restoreEta = "4 hours";
    storageState.lastMessage = "Archived an older object after the active access window closed.";
  }

  return snapshot();
}
