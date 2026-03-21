function backoff(attempt: number) {
  const base = Math.min(8000, 250 * 2 ** Math.min(attempt, 6));
  const jitter = Math.floor(base * 0.2 * Math.random());
  return base + jitter;
}

console.log(
  JSON.stringify(
    {
      attempts: Array.from({ length: 10 }, (_, i) => ({ attempt: i + 1, waitMs: backoff(i + 1) })),
      note: "Jitter prevents synchronized reconnect storms."
    },
    null,
    2,
  ),
);

