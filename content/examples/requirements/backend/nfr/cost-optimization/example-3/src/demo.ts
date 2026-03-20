type Allocation = { costCenter: string; weight: number };
type SharedCost = { name: string; usd: number; allocateTo: Allocation[] };

function allocate(cost: SharedCost) {
  const totalWeight = cost.allocateTo.reduce((acc, a) => acc + a.weight, 0);
  const out: Record<string, number> = {};
  for (const a of cost.allocateTo) {
    out[a.costCenter] = (out[a.costCenter] ?? 0) + (cost.usd * a.weight) / totalWeight;
  }
  return out;
}

const costs: SharedCost[] = [
  {
    name: "cdn",
    usd: 1200,
    allocateTo: [
      { costCenter: "feed", weight: 3 },
      { costCenter: "search", weight: 1 }
    ]
  },
  {
    name: "db",
    usd: 900,
    allocateTo: [
      { costCenter: "feed", weight: 1 },
      { costCenter: "search", weight: 1 }
    ]
  }
];

const budgets = { feed: 1700, search: 700 };
const totals: Record<string, number> = {};

for (const c of costs) {
  const split = allocate(c);
  for (const [k, v] of Object.entries(split)) totals[k] = (totals[k] ?? 0) + v;
}

const enforcement = Object.fromEntries(
  Object.entries(totals).map(([k, v]) => [k, { usd: Math.round(v * 100) / 100, withinBudget: v <= (budgets as any)[k] }])
);

console.log(JSON.stringify({ totals: enforcement, budgets }, null, 2));

