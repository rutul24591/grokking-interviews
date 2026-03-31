const pages = [
  { name: "marketing", baselineLcp: 2600, competitorLcp: 2200, goodThreshold: 2500 },
  { name: "dashboard", baselineLcp: 3200, competitorLcp: 2800, goodThreshold: 2500 },
];
for (const page of pages) {
  const budget = Math.min(page.baselineLcp * 0.8, page.competitorLcp, page.goodThreshold);
  console.log(`${page.name} -> derived LCP budget ${Math.round(budget)}ms`);
}
