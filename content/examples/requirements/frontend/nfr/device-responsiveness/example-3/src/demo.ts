type Scenario = { viewportPx: number; browserChromePx: number };

function compute(s: Scenario) {
  const vh = s.viewportPx; // naive 100vh
  const dvh = s.viewportPx - s.browserChromePx; // visible area
  return { ...s, css100vh: vh, css100dvh: dvh };
}

const scenarios: Scenario[] = [
  { viewportPx: 800, browserChromePx: 120 },
  { viewportPx: 800, browserChromePx: 40 },
];

console.log(JSON.stringify({ results: scenarios.map(compute) }, null, 2));
console.log(JSON.stringify({ ok: true }, null, 2));

