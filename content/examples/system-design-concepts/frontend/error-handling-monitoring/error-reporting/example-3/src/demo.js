function groupByFingerprint(events) {
  const grouped = new Map();

  for (const event of events) {
    const current = grouped.get(event.fingerprint) ?? { count: 0, releases: new Set(), severities: new Set() };
    current.count += 1;
    current.releases.add(event.release);
    current.severities.add(event.severity);
    grouped.set(event.fingerprint, current);
  }

  return [...grouped.entries()].map(([fingerprint, value]) => ({
    fingerprint,
    count: value.count,
    releases: [...value.releases],
    severities: [...value.severities]
  }));
}

console.log(
  groupByFingerprint([
    { fingerprint: "search-empty", release: "2026.04.01", severity: "error" },
    { fingerprint: "search-empty", release: "2026.04.01", severity: "error" },
    { fingerprint: "sidebar-crash", release: "2026.04.02", severity: "warning" }
  ])
);
