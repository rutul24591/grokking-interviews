function escalationPolicy(attempts, threshold, cooldownMs, lastFailureAt, now) {
  if (attempts < threshold) {
    return { action: "retry-widget", nextRetryInMs: 0 };
  }

  const cooldownRemaining = Math.max(cooldownMs - (now - lastFailureAt), 0);

  return cooldownRemaining > 0
    ? { action: "hold-hard-fallback", nextRetryInMs: cooldownRemaining }
    : { action: "half-open-retry", nextRetryInMs: 0 };
}

console.log(escalationPolicy(4, 3, 30_000, 90_000, 100_000));
