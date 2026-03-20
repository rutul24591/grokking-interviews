function headroomForBurst(p50: number, p95: number) {
  // toy heuristic: if p95 >> p50, bursts/queueing exist; increase headroom
  const ratio = p95 / p50;
  if (ratio < 1.5) return 0.2;
  if (ratio < 2.5) return 0.35;
  return 0.5;
}

console.log(
  JSON.stringify(
    {
      cases: [
        { p50: 120, p95: 160, suggestedHeadroom: headroomForBurst(120, 160) },
        { p50: 120, p95: 280, suggestedHeadroom: headroomForBurst(120, 280) },
        { p50: 120, p95: 500, suggestedHeadroom: headroomForBurst(120, 500) }
      ],
      note: "Real planning uses queueing models and traffic seasonality; this illustrates the burstiness intuition."
    },
    null,
    2,
  ),
);

