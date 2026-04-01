function shouldLock(attempts, threshold, windowMs, now) {
  const recent = attempts.filter((timestamp) => now - timestamp <= windowMs);
  return { recentAttempts: recent.length, locked: recent.length >= threshold };
}

const now = 1_000_000;
console.log(shouldLock([now - 1_000, now - 20_000, now - 50_000], 3, 60_000, now));
console.log(shouldLock([now - 1_000, now - 70_000, now - 90_000], 3, 60_000, now));
