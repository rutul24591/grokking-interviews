function resolveDraftConflict({ localRevision, remoteRevision, queuedChanges, reviewerLocked, offlineAgeMinutes }) {
  if (reviewerLocked) return { decision: "manual-merge", reason: "reviewer-lock-active" };
  if (localRevision === remoteRevision) return { decision: "restore-queued-draft", reason: "same-base-revision" };
  if (offlineAgeMinutes > 20) return { decision: "show-age-warning", reason: "offline-backlog-too-old" };
  if (queuedChanges > 3) return { decision: "show-diff-review", reason: "high-change-volume" };
  return { decision: "prompt-overwrite-warning", reason: "revision-mismatch" };
}

console.log([
  { localRevision: "rev-42", remoteRevision: "rev-43", queuedChanges: 4, reviewerLocked: false, offlineAgeMinutes: 8 },
  { localRevision: "rev-11", remoteRevision: "rev-15", queuedChanges: 2, reviewerLocked: false, offlineAgeMinutes: 36 }
].map(resolveDraftConflict));
