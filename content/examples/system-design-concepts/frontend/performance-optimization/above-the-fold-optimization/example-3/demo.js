const candidates = [
  { name: "targeted-critical-css", inlineCssBytes: 6200 },
  { name: "over-inlined-css", inlineCssBytes: 48100 },
];

const criticalBudgetBytes = 14 * 1024;

for (const candidate of candidates) {
  const withinBudget = candidate.inlineCssBytes <= criticalBudgetBytes;
  console.log(`\n${candidate.name}`);
  console.log(`inline CSS: ${candidate.inlineCssBytes} bytes`);
  console.log(`budget: ${criticalBudgetBytes} bytes`);
  console.log(withinBudget ? "status: acceptable" : "status: fail - HTML payload is too large");
}
