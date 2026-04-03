function planFormattingSurface({ timezoneSensitive, precisionSensitive, locale, surface }) {
  return {
    locale,
    surface,
    showTimezoneLabel: timezoneSensitive,
    useCompactNumbers: !precisionSensitive && surface !== "audit",
    requireRawMetricOnHover: precisionSensitive || surface === "audit"
  };
}

console.log([
  { timezoneSensitive: true, precisionSensitive: true, locale: "en-US", surface: "audit" },
  { timezoneSensitive: false, precisionSensitive: false, locale: "fr-FR", surface: "dashboard" },
  { timezoneSensitive: true, precisionSensitive: false, locale: "ar-EG", surface: "incident" }
].map(planFormattingSurface));
