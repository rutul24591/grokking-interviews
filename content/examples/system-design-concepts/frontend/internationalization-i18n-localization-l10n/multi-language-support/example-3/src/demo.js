function detectCrossLocaleGap({ requestedLocale, articleLocalized, examplesLocalized, searchLocalized, showFallbackBanner }) {
  return {
    showFallback: (!articleLocalized || !examplesLocalized || !searchLocalized) && showFallbackBanner,
    blockExampleTab: articleLocalized && !examplesLocalized,
    blockLocalizedSearch: articleLocalized && !searchLocalized,
    effectiveLocale: articleLocalized ? requestedLocale : "default"
  };
}

console.log([
  { requestedLocale: "fr", articleLocalized: true, examplesLocalized: false, searchLocalized: true, showFallbackBanner: true },
  { requestedLocale: "en", articleLocalized: true, examplesLocalized: true, searchLocalized: true, showFallbackBanner: false },
  { requestedLocale: "ar", articleLocalized: true, examplesLocalized: true, searchLocalized: false, showFallbackBanner: true }
].map(detectCrossLocaleGap));
