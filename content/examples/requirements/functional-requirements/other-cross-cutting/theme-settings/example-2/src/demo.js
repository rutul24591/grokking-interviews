function evaluateThemeSettings(profiles) {
  return profiles.map((entry) => ({
    profileId: entry.profileId,
    effectiveTheme: entry.explicitTheme || entry.systemTheme,
    showMismatchWarning: entry.embeddedSurfaceMismatch || entry.cachedStylesheetOld,
    allowSystemInherit: !entry.explicitTheme
  }));
}

console.log(JSON.stringify(evaluateThemeSettings([
  {
    "profileId": "th-1",
    "explicitTheme": "dark",
    "systemTheme": "light",
    "embeddedSurfaceMismatch": false,
    "cachedStylesheetOld": false
  },
  {
    "profileId": "th-2",
    "explicitTheme": "",
    "systemTheme": "dark",
    "embeddedSurfaceMismatch": true,
    "cachedStylesheetOld": false
  },
  {
    "profileId": "th-3",
    "explicitTheme": "light",
    "systemTheme": "dark",
    "embeddedSurfaceMismatch": false,
    "cachedStylesheetOld": true
  }
]), null, 2));
