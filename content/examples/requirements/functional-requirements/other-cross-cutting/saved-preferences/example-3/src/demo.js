function evaluateSavedPreferenceEdges(profiles) {
  return profiles.map((entry) => ({
    profileId: entry.profileId,
    rejectStaleWrite: entry.versionTokenMismatch,
    rebuildBackupIndex: entry.backupMetadataMissing,
    downgradeLegacyValue: entry.legacyEnumDetected
  }));
}

console.log(JSON.stringify(evaluateSavedPreferenceEdges([
  {
    "profileId": "edge-1",
    "versionTokenMismatch": true,
    "backupMetadataMissing": false,
    "legacyEnumDetected": false
  },
  {
    "profileId": "edge-2",
    "versionTokenMismatch": false,
    "backupMetadataMissing": true,
    "legacyEnumDetected": false
  },
  {
    "profileId": "edge-3",
    "versionTokenMismatch": false,
    "backupMetadataMissing": false,
    "legacyEnumDetected": true
  }
]), null, 2));
