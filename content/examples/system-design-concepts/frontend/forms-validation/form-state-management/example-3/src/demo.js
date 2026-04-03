function detectPartialSaveConflict({ dirtyKeys, savedKeys, derivedSummaryVersion, currentVersion, reviewerCoverageChanged }) {
  const unsavedDirty = dirtyKeys.filter((key) => !savedKeys.includes(key));
  return {
    unsavedDirty,
    staleDerivedSummary: derivedSummaryVersion !== currentVersion,
    reviewerCoverageChanged,
    requiresRecompute: unsavedDirty.length > 0 || derivedSummaryVersion !== currentVersion || reviewerCoverageChanged
  };
}

console.log([
  { dirtyKeys: ["workspaceName", "runbookVersion"], savedKeys: ["workspaceName"], derivedSummaryVersion: "v5", currentVersion: "v6", reviewerCoverageChanged: false },
  { dirtyKeys: ["reviewers"], savedKeys: [], derivedSummaryVersion: "v6", currentVersion: "v6", reviewerCoverageChanged: true }
].map(detectPartialSaveConflict));
