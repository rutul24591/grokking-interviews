function littlesLaw(rps: number, latencyMs: number) {
  return Math.ceil(rps * (latencyMs / 1000));
}

console.log(
  JSON.stringify(
    {
      examples: [
        { rps: 500, p95LatencyMs: 200, concurrency: littlesLaw(500, 200) },
        { rps: 1200, p95LatencyMs: 350, concurrency: littlesLaw(1200, 350) }
      ]
    },
    null,
    2,
  ),
);

