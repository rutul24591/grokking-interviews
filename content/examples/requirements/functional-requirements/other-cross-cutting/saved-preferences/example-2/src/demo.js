function evaluateSavedPreferences(profiles) {
  return profiles.map((entry) => ({
    profileId: entry.profileId,
    persistOverride: entry.userValuePresent && !entry.conflictDetected,
    showInheritanceHint: !entry.userValuePresent && entry.teamDefaultPresent,
    offerRestoreDiff: entry.backupValuePresent && entry.backupDiffers
  }));
}

console.log(JSON.stringify(evaluateSavedPreferences([
  {
    "profileId": "sp-1",
    "userValuePresent": true,
    "conflictDetected": false,
    "teamDefaultPresent": true,
    "backupValuePresent": true,
    "backupDiffers": false
  },
  {
    "profileId": "sp-2",
    "userValuePresent": false,
    "conflictDetected": false,
    "teamDefaultPresent": true,
    "backupValuePresent": false,
    "backupDiffers": false
  },
  {
    "profileId": "sp-3",
    "userValuePresent": true,
    "conflictDetected": true,
    "teamDefaultPresent": false,
    "backupValuePresent": true,
    "backupDiffers": true
  }
]), null, 2));
