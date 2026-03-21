import { AxeSummarySchema, assertNoRegression } from "./budget";

const baseline = AxeSummarySchema.parse({
  totalViolations: 2,
  byImpact: { minor: 1, serious: 1 },
  violations: [
    { id: "label", impact: "serious", nodes: [{ target: ["input[name=email]"] }] },
    { id: "color-contrast", impact: "minor", nodes: [{ target: [".bad"] }] },
  ],
});

const current = AxeSummarySchema.parse({
  totalViolations: 3,
  byImpact: { minor: 1, serious: 2 },
  violations: [
    { id: "label", impact: "serious", nodes: [{ target: ["input[name=email]"] }] },
    { id: "label", impact: "serious", nodes: [{ target: ["input[name=name]"] }] },
    { id: "color-contrast", impact: "minor", nodes: [{ target: [".bad"] }] },
  ],
});

const report = assertNoRegression({ baseline, current, maxScoreDelta: 0 });
console.log(JSON.stringify(report, null, 2));

if (!report.ok) {
  console.error("A11y regression detected (score delta exceeded budget).");
  process.exit(1);
}

