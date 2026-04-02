function detectBookmarkConflicts(entries) {
  const conflicting = entries.filter((entry) => entry.localSaved !== entry.remoteSaved).map((entry) => entry.id);
  const movedCollections = entries.filter((entry) => entry.localCollection !== entry.remoteCollection).map((entry) => entry.id);
  return {
    conflicting,
    movedCollections,
    requireMerge: conflicting.length > 0 || movedCollections.length > 0,
    preferNewestWrite: entries.some((entry) => entry.versionSkew > 1)
  };
}

console.log(detectBookmarkConflicts([
  { id: "bm-1", localSaved: true, remoteSaved: false, localCollection: "backend", remoteCollection: "backend", versionSkew: 0 },
  { id: "bm-2", localSaved: true, remoteSaved: true, localCollection: "prep", remoteCollection: "all", versionSkew: 2 }
]));
