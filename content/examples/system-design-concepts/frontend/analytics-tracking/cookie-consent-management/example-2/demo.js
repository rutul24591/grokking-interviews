function needsReconsent(stored, currentVersion) {
  return !stored || stored.version !== currentVersion;
}

console.log(needsReconsent({ version: "2026-02", analytics: true }, "2026-03"));
console.log(needsReconsent({ version: "2026-03", analytics: true }, "2026-03"));
console.log(needsReconsent(null, "2026-03"));
