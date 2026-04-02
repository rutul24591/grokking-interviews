import { Semaphore, TokenBucket } from "./limiters";

type Tenant = {
  id: string;
  rps: TokenBucket;
  bulkhead: Semaphore;
  produced: number;
  accepted: number;
  rejected: number;
};

async function sleep(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}

async function simulate(params: { mode: "shared" | "bulkhead"; durationMs: number }) {
  const { mode, durationMs } = params;
  const global = new Semaphore(20);

  const tenants: Tenant[] = [
    { id: "enterprise", rps: new TokenBucket({ capacity: 200, refillPerSec: 200 }), bulkhead: new Semaphore(8), produced: 0, accepted: 0, rejected: 0 },
    { id: "free", rps: new TokenBucket({ capacity: 40, refillPerSec: 40 }), bulkhead: new Semaphore(3), produced: 0, accepted: 0, rejected: 0 },
  ];

  const stopAt = Date.now() + durationMs;
  while (Date.now() < stopAt) {
    // Free tenant spikes aggressively.
    for (let i = 0; i < 25; i += 1) produce(tenants[1]);
    // Enterprise is steady.
    for (let i = 0; i < 5; i += 1) produce(tenants[0]);

    await sleep(10);
  }

  return {
    mode,
    tenants: tenants.map((t) => ({
      id: t.id,
      produced: t.produced,
      accepted: t.accepted,
      rejected: t.rejected,
      acceptanceRate: t.produced === 0 ? 1 : t.accepted / t.produced,
    })),
    interpretation:
      mode === "shared"
        ? "Shared pool: the spiky tenant consumes global permits and increases enterprise rejection."
        : "Bulkhead: enterprise has reserved concurrency and stays more stable.",
  };

  function produce(t: Tenant) {
    t.produced += 1;
    if (!t.rps.take(1)) {
      t.rejected += 1;
      return;
    }
    if (!global.tryAcquire()) {
      t.rejected += 1;
      return;
    }
    const okTenant = mode === "bulkhead" ? t.bulkhead.tryAcquire() : true;
    if (!okTenant) {
      global.release();
      t.rejected += 1;
      return;
    }
    t.accepted += 1;
    // Release immediately; this simulation focuses on admission fairness, not work time.
    if (mode === "bulkhead") t.bulkhead.release();
    global.release();
  }
}

const shared = await simulate({ mode: "shared", durationMs: 1500 });
const bulkhead = await simulate({ mode: "bulkhead", durationMs: 1500 });
console.log(JSON.stringify({ shared, bulkhead }, null, 2));

