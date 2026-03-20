type Event = {
  ts: number;
  sessionId: string;
  type: "web_vital" | "error";
  name: string;
  value?: number;
};

function percentile(values: number[], p: number) {
  if (values.length === 0) return undefined;
  const sorted = [...values].sort((a, b) => a - b);
  const idx = Math.min(sorted.length - 1, Math.max(0, Math.floor((p / 100) * sorted.length)));
  return sorted[idx];
}

function fingerprintError(name: string) {
  return name.toLowerCase().replace(/\\d+/g, "#");
}

function apdexMs(values: number[], t: number) {
  if (values.length === 0) return undefined;
  let satisfied = 0;
  let tolerated = 0;
  for (const v of values) {
    if (v <= t) satisfied++;
    else if (v <= 4 * t) tolerated++;
  }
  return (satisfied + tolerated / 2) / values.length;
}

const events: Event[] = [
  { ts: 1, sessionId: "s1", type: "web_vital", name: "lcp", value: 900 },
  { ts: 2, sessionId: "s1", type: "web_vital", name: "lcp", value: 1100 },
  { ts: 3, sessionId: "s1", type: "error", name: "TypeError: x is not a function" },
  { ts: 4, sessionId: "s2", type: "web_vital", name: "lcp", value: 2400 },
  { ts: 5, sessionId: "s2", type: "error", name: "TypeError: x is not a function" },
  { ts: 6, sessionId: "s2", type: "error", name: "ChunkLoadError: Loading chunk 123 failed" },
  { ts: 7, sessionId: "s3", type: "web_vital", name: "lcp", value: 1700 },
  { ts: 8, sessionId: "s3", type: "error", name: "ChunkLoadError: Loading chunk 456 failed" },
];

const lcp = events.filter((e) => e.type === "web_vital" && e.name === "lcp" && typeof e.value === "number").map((e) => e.value!);

const errorFingerprints = new Map<string, number>();
for (const e of events) {
  if (e.type !== "error") continue;
  const fp = fingerprintError(e.name);
  errorFingerprints.set(fp, (errorFingerprints.get(fp) || 0) + 1);
}

console.log(
  JSON.stringify(
    {
      lcp: {
        count: lcp.length,
        p50: percentile(lcp, 50),
        p95: percentile(lcp, 95),
        apdexT1200: apdexMs(lcp, 1200),
      },
      errors: [...errorFingerprints.entries()].sort((a, b) => b[1] - a[1]).map(([fingerprint, count]) => ({ fingerprint, count })),
    },
    null,
    2,
  ),
);

