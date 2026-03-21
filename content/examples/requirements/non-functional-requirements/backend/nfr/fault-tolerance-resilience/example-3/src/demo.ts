type Hop = { name: string; budgetMs: number };

function splitBudget(totalMs: number): Hop[] {
  return [
    { name: "auth", budgetMs: Math.round(totalMs * 0.2) },
    { name: "db", budgetMs: Math.round(totalMs * 0.5) },
    { name: "cache", budgetMs: Math.round(totalMs * 0.2) },
    { name: "misc", budgetMs: totalMs - Math.round(totalMs * 0.9) }
  ];
}

function shouldHedge(p95Ms: number, hedgeAfterMs: number) {
  return p95Ms > hedgeAfterMs;
}

console.log(
  JSON.stringify(
    {
      budget: splitBudget(800),
      hedge: shouldHedge(320, 200)
    },
    null,
    2
  )
);

