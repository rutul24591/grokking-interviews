function evaluateImportUserData(imports) {
  return imports.map((entry) => ({
    importId: entry.importId,
    allowImport: entry.schemaValid && entry.entitlementOk && !entry.quotaExceeded,
    requireFieldMapping: entry.legacyFieldsPresent || entry.enumMismatchFound,
    manualMergeReview: entry.duplicateIdentifiers || entry.ownershipAmbiguous
  }));
}

console.log(JSON.stringify(evaluateImportUserData([
  {
    "importId": "im-1",
    "schemaValid": true,
    "entitlementOk": true,
    "quotaExceeded": false,
    "legacyFieldsPresent": false,
    "enumMismatchFound": false,
    "duplicateIdentifiers": false,
    "ownershipAmbiguous": false
  },
  {
    "importId": "im-2",
    "schemaValid": true,
    "entitlementOk": false,
    "quotaExceeded": true,
    "legacyFieldsPresent": true,
    "enumMismatchFound": true,
    "duplicateIdentifiers": false,
    "ownershipAmbiguous": false
  },
  {
    "importId": "im-3",
    "schemaValid": false,
    "entitlementOk": true,
    "quotaExceeded": false,
    "legacyFieldsPresent": false,
    "enumMismatchFound": false,
    "duplicateIdentifiers": true,
    "ownershipAmbiguous": true
  }
]), null, 2));
