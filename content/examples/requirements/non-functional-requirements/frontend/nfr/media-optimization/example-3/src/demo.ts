type Asset = { path: string; bytes: number; type: "image" | "video" | "font" };

function kb(n: number) {
  return Math.round((n / 1024) * 10) / 10;
}

function enforceBudget(assets: Asset[], budgets: Record<Asset["type"], number>) {
  const byType: Record<string, number> = {};
  for (const a of assets) byType[a.type] = (byType[a.type] || 0) + a.bytes;
  const violations = Object.entries(budgets)
    .filter(([type, max]) => (byType[type] || 0) > max)
    .map(([type, max]) => ({ type, totalBytes: byType[type] || 0, budgetBytes: max }));
  return { byType, violations };
}

const assets: Asset[] = [
  { path: "/hero.avif", bytes: 180_000, type: "image" },
  { path: "/product.webp", bytes: 120_000, type: "image" },
  { path: "/intro.mp4", bytes: 2_400_000, type: "video" },
  { path: "/inter.woff2", bytes: 45_000, type: "font" },
];

const budgets = {
  image: 350_000,
  video: 2_000_000,
  font: 80_000,
} as const;

const out = enforceBudget(assets, budgets);

console.log(
  JSON.stringify(
    {
      budgetsKb: Object.fromEntries(Object.entries(budgets).map(([k, v]) => [k, kb(v)])),
      totalsKb: Object.fromEntries(Object.entries(out.byType).map(([k, v]) => [k, kb(v)])),
      violations: out.violations.map((v) => ({ ...v, totalKb: kb(v.totalBytes), budgetKb: kb(v.budgetBytes) })),
      guidance: [
        "Budgets belong in CI: fail fast when media creep happens.",
        "Treat fonts as media: too many weights/variants can dominate first-load bytes.",
      ],
    },
    null,
    2,
  ),
);

