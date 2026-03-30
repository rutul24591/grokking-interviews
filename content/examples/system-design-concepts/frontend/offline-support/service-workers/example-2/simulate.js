function pct(n) {
  return `${Math.round(n * 100)}%`;
}

function jitter(ms, spread = 0.2) {
  const delta = ms * spread;
  return ms + (Math.random() * 2 - 1) * delta;
}

async function simulatedFetch({ baseLatencyMs, offlineRate }) {
  await new Promise((r) => setTimeout(r, jitter(baseLatencyMs)));
  if (Math.random() < offlineRate) throw new Error("network-failure");
  return { ok: true, value: `payload-${Math.random().toString(16).slice(2)}` };
}

async function runStrategy(name, fn, rounds = 50) {
  let hits = 0;
  let misses = 0;
  let failures = 0;
  let totalLatency = 0;

  const cache = new Map();

  for (let i = 0; i < rounds; i++) {
    const t0 = Date.now();
    try {
      const r = await fn({ cache });
      if (r.source === "cache") hits++;
      else misses++;
    } catch {
      failures++;
    } finally {
      totalLatency += Date.now() - t0;
    }
  }

  return {
    name,
    hits,
    misses,
    failures,
    hitRate: hits / Math.max(1, hits + misses),
    avgLatencyMs: Math.round(totalLatency / rounds)
  };
}

function cacheFirst({ baseLatencyMs, offlineRate }) {
  return async ({ cache }) => {
    if (cache.has("k")) return { source: "cache", value: cache.get("k") };
    const res = await simulatedFetch({ baseLatencyMs, offlineRate });
    cache.set("k", res.value);
    return { source: "network", value: res.value };
  };
}

function networkFirst({ baseLatencyMs, offlineRate }) {
  return async ({ cache }) => {
    try {
      const res = await simulatedFetch({ baseLatencyMs, offlineRate });
      cache.set("k", res.value);
      return { source: "network", value: res.value };
    } catch {
      if (cache.has("k")) return { source: "cache", value: cache.get("k") };
      throw new Error("miss");
    }
  };
}

function staleWhileRevalidate({ baseLatencyMs, offlineRate }) {
  return async ({ cache }) => {
    const cached = cache.get("k");
    // Background update
    simulatedFetch({ baseLatencyMs, offlineRate })
      .then((res) => cache.set("k", res.value))
      .catch(() => {});

    if (cached) return { source: "cache", value: cached };
    const res = await simulatedFetch({ baseLatencyMs, offlineRate });
    cache.set("k", res.value);
    return { source: "network", value: res.value };
  };
}

const params = {
  baseLatencyMs: Number(process.env.LATENCY_MS || 180),
  offlineRate: Number(process.env.OFFLINE_RATE || 0.15)
};

const results = await Promise.all([
  runStrategy("cache-first", cacheFirst(params)),
  runStrategy("network-first", networkFirst(params)),
  runStrategy("stale-while-revalidate", staleWhileRevalidate(params))
]);

for (const r of results) {
  // eslint-disable-next-line no-console
  console.log(
    `${r.name.padEnd(22)} hitRate=${pct(r.hitRate).padEnd(6)} avgLatency=${String(r.avgLatencyMs).padStart(4)}ms failures=${r.failures}`,
  );
}

// eslint-disable-next-line no-console
console.log("\nTune with env vars: LATENCY_MS=250 OFFLINE_RATE=0.3 node simulate.js");

