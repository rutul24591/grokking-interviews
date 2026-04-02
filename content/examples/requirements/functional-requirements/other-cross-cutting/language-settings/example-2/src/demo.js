function evaluateLanguageSettings(profiles) {
  return profiles.map((entry) => ({
    profileId: entry.profileId,
    effectiveLocale: entry.userLocale || entry.browserLocale || entry.systemLocale,
    showFallbackWarning: entry.missingTranslations > 0,
    needsLocaleResync: entry.serverLocaleMismatch || entry.cachedBundleOld
  }));
}

console.log(JSON.stringify(evaluateLanguageSettings([
  {
    "profileId": "ls-1",
    "userLocale": "fr-FR",
    "browserLocale": "en-US",
    "systemLocale": "en-US",
    "missingTranslations": 0,
    "serverLocaleMismatch": false,
    "cachedBundleOld": false
  },
  {
    "profileId": "ls-2",
    "userLocale": "",
    "browserLocale": "de-DE",
    "systemLocale": "en-US",
    "missingTranslations": 4,
    "serverLocaleMismatch": true,
    "cachedBundleOld": false
  },
  {
    "profileId": "ls-3",
    "userLocale": "",
    "browserLocale": "",
    "systemLocale": "en-US",
    "missingTranslations": 1,
    "serverLocaleMismatch": false,
    "cachedBundleOld": true
  }
]), null, 2));
