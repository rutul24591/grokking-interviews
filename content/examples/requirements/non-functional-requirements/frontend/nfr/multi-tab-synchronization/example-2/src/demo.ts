type Lease = { leader: string; expiresAt: number };

function tryAcquire(lease: Lease | null, candidate: string, now: number, ttlMs: number): Lease {
  if (!lease || lease.expiresAt <= now) return { leader: candidate, expiresAt: now + ttlMs };
  return lease;
}

function renew(lease: Lease, leader: string, now: number, ttlMs: number): Lease {
  if (lease.leader !== leader) return lease;
  return { leader, expiresAt: now + ttlMs };
}

let lease: Lease | null = null;
const ttl = 6_000;

// simulate 3 tabs; tab A “crashes” at t=10s
const tabs = ["A", "B", "C"];
const log: Array<{ t: number; lease: Lease | null }> = [];

for (let t = 0; t <= 20_000; t += 2_000) {
  for (const tab of tabs) {
    const crashed = tab === "A" && t >= 10_000;
    if (crashed) continue;
    lease = tryAcquire(lease, tab, t, ttl);
    if (lease && lease.leader === tab) lease = renew(lease, tab, t, ttl);
  }
  log.push({ t, lease });
}

console.log(JSON.stringify({ ttl, log }, null, 2));

