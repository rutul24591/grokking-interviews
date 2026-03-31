const budgets = { routeJsKb: 140, cssKb: 30, lcpMs: 2500 };
const actual = { routeJsKb: 151, cssKb: 24, lcpMs: 2380 };
for (const [key, limit] of Object.entries(budgets)) {
  const value = actual[key];
  console.log(`${key}: ${value} / ${limit} -> ${value <= limit ? "pass" : "fail"}`);
}
