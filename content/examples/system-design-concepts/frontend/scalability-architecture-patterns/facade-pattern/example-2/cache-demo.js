function createSWRCache({ ttlMs }) {
  /** @type {{ value: any, expiresAt: number, refresh?: Promise<any> } | null} */
  let entry = null;

  async function get(fetcher) {
    const now = Date.now();
    if (entry && entry.expiresAt > now) return { value: entry.value, fresh: true };

    // Serve stale if available while refreshing.
    if (entry && entry.value) {
      if (!entry.refresh) entry.refresh = fetcher().then((v) => ((entry = { value: v, expiresAt: Date.now() + ttlMs }), v));
      return { value: entry.value, fresh: false };
    }

    const v = await fetcher();
    entry = { value: v, expiresAt: Date.now() + ttlMs };
    return { value: v, fresh: true };
  }

  return { get };
}

const cache = createSWRCache({ ttlMs: 200 });

async function expensiveAggregate() {
  await new Promise((r) => setTimeout(r, 80));
  return { ts: Date.now(), value: Math.random() };
}

for (let i = 0; i < 8; i += 1) {
  const r = await cache.get(expensiveAggregate);
  process.stdout.write(`${i} fresh=${r.fresh} value.ts=${r.value.ts}\n`);
  await new Promise((r2) => setTimeout(r2, 70));
}

