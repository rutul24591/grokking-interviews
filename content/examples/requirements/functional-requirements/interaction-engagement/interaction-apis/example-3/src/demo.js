function detectApiEdgeCases(results) {
  const degraded = results.filter((result) => result.status !== 200 && result.fallbackAvailable).map((result) => result.id);
  const unsafeRetries = results.filter((result) => result.status >= 500 && !result.idempotent).map((result) => result.id);
  return {
    degraded,
    unsafeRetries,
    queueRetry: degraded.length > 0,
    blockAutomaticRetry: unsafeRetries.length > 0
  };
}

console.log(detectApiEdgeCases([
  { id: "like", status: 503, fallbackAvailable: true, idempotent: true },
  { id: "save", status: 502, fallbackAvailable: false, idempotent: false }
]));
