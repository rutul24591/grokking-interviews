function chooseIndicator(ms: number) {
  // Practical heuristic:
  // - <150ms: show nothing (avoid flicker)
  // - 150–700ms: show skeleton (perceived progress)
  // - >700ms: show spinner + message (it’s “slow”)
  if (ms < 150) return "none";
  if (ms < 700) return "skeleton";
  return "spinner";
}

const samples = [40, 120, 180, 420, 690, 900, 1800];

console.log(
  JSON.stringify(
    {
      samples,
      decisions: samples.map((ms) => ({ ms, indicator: chooseIndicator(ms) })),
      note: "Tune thresholds from RUM percentiles; defaults vary by product and audience."
    },
    null,
    2,
  ),
);

