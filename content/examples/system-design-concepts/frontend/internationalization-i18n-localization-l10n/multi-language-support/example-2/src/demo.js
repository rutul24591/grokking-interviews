function evaluateLocaleLaunch({ coverage, translatedNavigation, translatedExamples, translatedSearch }) {
  return {
    launchReady: coverage >= 95 && translatedNavigation,
    allowExampleTab: coverage >= 90 && translatedExamples,
    allowLocalizedSearch: coverage >= 90 && translatedSearch,
    fallbackBanner: coverage < 100
  };
}

console.log([
  { coverage: 100, translatedNavigation: true, translatedExamples: true, translatedSearch: true },
  { coverage: 78, translatedNavigation: true, translatedExamples: false, translatedSearch: false },
  { coverage: 92, translatedNavigation: true, translatedExamples: true, translatedSearch: false }
].map(evaluateLocaleLaunch));
