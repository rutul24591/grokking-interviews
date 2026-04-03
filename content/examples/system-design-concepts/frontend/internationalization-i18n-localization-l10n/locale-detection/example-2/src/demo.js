function resolveLocaleDecision({ urlLocale, savedPreference, acceptLanguage, geoFallback, forcedLocale }) {
  return {
    resolved: forcedLocale || urlLocale || savedPreference || acceptLanguage || geoFallback || "en",
    source: forcedLocale ? "forced" : urlLocale ? "url" : savedPreference ? "saved" : acceptLanguage ? "accept-language" : geoFallback ? "geo" : "default"
  };
}

console.log([
  { urlLocale: "", savedPreference: "fr", acceptLanguage: "ar", geoFallback: "ja", forcedLocale: "" },
  { urlLocale: "ar", savedPreference: "fr", acceptLanguage: "en", geoFallback: "ja", forcedLocale: "" },
  { urlLocale: "en", savedPreference: "fr", acceptLanguage: "ar", geoFallback: "ja", forcedLocale: "ja" }
].map(resolveLocaleDecision));
