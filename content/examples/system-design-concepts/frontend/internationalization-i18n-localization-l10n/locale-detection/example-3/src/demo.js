function detectLocaleConflict({ routeLocale, cookieLocale, profileLocale, forcedLocale, exampleTabLocale }) {
  return {
    needsRedirect: Boolean(routeLocale && forcedLocale && routeLocale !== forcedLocale),
    useProfileOverCookie: Boolean(profileLocale && cookieLocale && profileLocale !== cookieLocale),
    tabMismatch: Boolean(exampleTabLocale && exampleTabLocale !== (forcedLocale || routeLocale || profileLocale || cookieLocale || "en")),
    finalHint: forcedLocale || routeLocale || profileLocale || cookieLocale || "en"
  };
}

console.log([
  { routeLocale: "fr", cookieLocale: "en", profileLocale: "fr", forcedLocale: "", exampleTabLocale: "fr" },
  { routeLocale: "en", cookieLocale: "ar", profileLocale: "fr", forcedLocale: "ja", exampleTabLocale: "en" }
].map(detectLocaleConflict));
