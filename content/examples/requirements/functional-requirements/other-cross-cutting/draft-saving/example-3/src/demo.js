function evaluateDraftEdges(drafts) {
  return drafts.map((entry) => ({
    draftId: entry.draftId,
    dropDuplicateReplay: entry.offlineQueueRepeated,
    freezeAutosave: entry.editorSchemaChanged,
    rebuildCursorState: entry.mergeAcceptedAfterTabConflict
  }));
}

console.log(JSON.stringify(evaluateDraftEdges([
  {
    "draftId": "edge-1",
    "offlineQueueRepeated": true,
    "editorSchemaChanged": false,
    "mergeAcceptedAfterTabConflict": false
  },
  {
    "draftId": "edge-2",
    "offlineQueueRepeated": false,
    "editorSchemaChanged": true,
    "mergeAcceptedAfterTabConflict": false
  },
  {
    "draftId": "edge-3",
    "offlineQueueRepeated": false,
    "editorSchemaChanged": false,
    "mergeAcceptedAfterTabConflict": true
  }
]), null, 2));
