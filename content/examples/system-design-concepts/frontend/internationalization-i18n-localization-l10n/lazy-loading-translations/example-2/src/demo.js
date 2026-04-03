function planTranslationBundleLoad({ routeCritical, currentLocale, nextLocale, alreadyCached, sharesNamespace }) {
  return {
    preload: routeCritical && !alreadyCached,
    localePair: `${currentLocale}->${nextLocale}`,
    strategy: alreadyCached ? "reuse-cache" : routeCritical ? "background-preload" : "load-on-demand",
    canReuseNamespaceSkeleton: sharesNamespace
  };
}

console.log([
  { routeCritical: true, currentLocale: "en", nextLocale: "fr", alreadyCached: false, sharesNamespace: true },
  { routeCritical: false, currentLocale: "en", nextLocale: "ar", alreadyCached: true, sharesNamespace: false },
  { routeCritical: true, currentLocale: "en", nextLocale: "ja", alreadyCached: false, sharesNamespace: false }
].map(planTranslationBundleLoad));
