const rows = [
  { comparatorCostMs: 0.08, renderCostMs: 2.4 },
  { comparatorCostMs: 1.5, renderCostMs: 1.1 },
];

for (const row of rows) {
  const worthwhile = row.comparatorCostMs < row.renderCostMs;
  console.log(`${JSON.stringify(row)} -> ${worthwhile ? "memo comparator worthwhile" : "comparator too expensive"}`);
}
