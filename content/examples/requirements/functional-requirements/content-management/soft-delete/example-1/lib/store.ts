const softDeleteState = {
  title: "Publishing workflow",
  deleted: false,
  purgeInDays: 30,
  recoverable: true,
  visibleInFeed: true,
  lastMessage: "Soft delete should remove content from active surfaces without immediately destroying recovery options."
};

export function snapshot() {
  return structuredClone(softDeleteState);
}

export function mutate(type: "delete" | "restore") {
  if (type === "delete") {
    softDeleteState.deleted = true;
    softDeleteState.recoverable = true;
    softDeleteState.visibleInFeed = false;
    softDeleteState.lastMessage = "Content moved to soft-deleted state and was removed from active discovery surfaces.";
  }

  if (type === "restore") {
    softDeleteState.deleted = false;
    softDeleteState.visibleInFeed = true;
    softDeleteState.lastMessage = "Content restored from soft-delete before purge window expired.";
  }

  return snapshot();
}
