function evaluateDraftSaving(drafts) {
  return drafts.map((entry) => ({
    draftId: entry.draftId,
    canAutosave: entry.localDirty && !entry.versionConflict && entry.networkHealthy,
    queueOfflineSave: entry.localDirty && !entry.networkHealthy,
    showMergePrompt: entry.versionConflict || entry.remoteNewerVersion
  }));
}

console.log(JSON.stringify(evaluateDraftSaving([
  {
    "draftId": "d-1",
    "localDirty": true,
    "versionConflict": false,
    "networkHealthy": true,
    "remoteNewerVersion": false
  },
  {
    "draftId": "d-2",
    "localDirty": true,
    "versionConflict": false,
    "networkHealthy": false,
    "remoteNewerVersion": false
  },
  {
    "draftId": "d-3",
    "localDirty": true,
    "versionConflict": true,
    "networkHealthy": true,
    "remoteNewerVersion": true
  }
]), null, 2));
