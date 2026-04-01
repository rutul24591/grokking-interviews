function taggingConflict(existingTags, incomingTag, blockedTags) {
  const normalized = incomingTag.toLowerCase().trim();
  return {
    action: blockedTags.includes(normalized)
      ? "reject-blocked-tag"
      : existingTags.includes(normalized)
        ? "ignore-duplicate"
        : normalized.includes(" ")
          ? "normalize-tag"
          : "append-tag",
    duplicate: existingTags.includes(normalized),
    blocked: blockedTags.includes(normalized)
  };
}

console.log(taggingConflict(["frontend", "rendering"], "internal only", ["internal only", "deprecated"]));
