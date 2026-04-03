function planTranslationRelease({ missingCriticalKeys, keysInReview, stagedRollout, exampleTabsEnabled }) {
  return {
    blockRelease: missingCriticalKeys > 0,
    requireBanner: keysInReview > 0,
    useStagedRollout: keysInReview > 0 && stagedRollout,
    allowExampleTab: missingCriticalKeys === 0 && exampleTabsEnabled
  };
}

console.log([
  { missingCriticalKeys: 0, keysInReview: 2, stagedRollout: true, exampleTabsEnabled: true },
  { missingCriticalKeys: 1, keysInReview: 0, stagedRollout: false, exampleTabsEnabled: true },
  { missingCriticalKeys: 0, keysInReview: 0, stagedRollout: false, exampleTabsEnabled: false }
].map(planTranslationRelease));
