type Decision = { active: boolean; exp: number; revokedAt?: number };

function shouldCache(decision: Decision) {
  // Example policy: cache only active decisions and never beyond min(5s, time-to-expiry).
  if (!decision.active) return { ttlMs: 0, reason: "do_not_cache_denies" };
  const timeToExpiry = Math.max(0, decision.exp - Date.now());
  return { ttlMs: Math.min(5000, timeToExpiry), reason: "bounded_by_expiry" };
}

const active = { active: true, exp: Date.now() + 12_000 };
const revoked = { active: false, exp: Date.now() + 12_000, revokedAt: Date.now() };

console.log(JSON.stringify({ active: shouldCache(active), revoked: shouldCache(revoked) }, null, 2));

