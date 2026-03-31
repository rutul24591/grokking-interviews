const thresholds = [
  { failures: 2, falseOpens: "higher" },
  { failures: 5, falseOpens: "lower" },
];
for (const threshold of thresholds) {
  console.log(`trip after ${threshold.failures} failures -> false-open risk ${threshold.falseOpens}`);
}
