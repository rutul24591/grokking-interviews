type Budget = { name: string; maxMsP95: number };

function evaluate(p95: Record<string, number>, budgets: Budget[]) {
  const violations = budgets
    .filter((b) => (p95[b.name] ?? Infinity) > b.maxMsP95)
    .map((b) => ({ metric: b.name, p95: p95[b.name], budget: b.maxMsP95 }));
  return { ok: violations.length === 0, violations };
}

const budgets: Budget[] = [
  { name: "ttfb", maxMsP95: 600 },
  { name: "lcp", maxMsP95: 2500 },
  { name: "inp", maxMsP95: 200 }
];

const observedP95 = { ttfb: 540, lcp: 3100, inp: 180 };
const out = evaluate(observedP95, budgets);

console.log(JSON.stringify({ budgets, observedP95, out }, null, 2));

