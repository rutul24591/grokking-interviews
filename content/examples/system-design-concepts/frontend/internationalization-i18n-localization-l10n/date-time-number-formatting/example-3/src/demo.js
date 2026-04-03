function detectFormattingMismatch({ serverTimezone, browserTimezone, surfaceType, usesCompactNumbers, hidesRawUtc }) {
  return {
    mismatch: serverTimezone !== browserTimezone,
    blockCompactNumbers: surfaceType === "audit" && usesCompactNumbers,
    requireRawUtc: surfaceType !== "dashboard" && hidesRawUtc,
    action: serverTimezone !== browserTimezone ? "label-timezone-source" : "no-timezone-warning"
  };
}

console.log([
  { serverTimezone: "UTC", browserTimezone: "America/New_York", surfaceType: "audit", usesCompactNumbers: true, hidesRawUtc: true },
  { serverTimezone: "UTC", browserTimezone: "UTC", surfaceType: "dashboard", usesCompactNumbers: false, hidesRawUtc: false },
  { serverTimezone: "Europe/Paris", browserTimezone: "Africa/Cairo", surfaceType: "incident", usesCompactNumbers: false, hidesRawUtc: true }
].map(detectFormattingMismatch));
