function evaluateImportEdges(imports) {
  return imports.map((entry) => ({
    importId: entry.importId,
    replayValidation: entry.transformerVersionChanged,
    splitBatch: entry.fileTooLarge,
    dropUnsafeRecords: entry.permissionBackfillMissing
  }));
}

console.log(JSON.stringify(evaluateImportEdges([
  {
    "importId": "edge-1",
    "transformerVersionChanged": true,
    "fileTooLarge": false,
    "permissionBackfillMissing": false
  },
  {
    "importId": "edge-2",
    "transformerVersionChanged": false,
    "fileTooLarge": true,
    "permissionBackfillMissing": false
  },
  {
    "importId": "edge-3",
    "transformerVersionChanged": false,
    "fileTooLarge": false,
    "permissionBackfillMissing": true
  }
]), null, 2));
