const inflight = new Map<string, Promise<number>>();

async function singleflight(key: string, fn: () => Promise<number>) {
  const existing = inflight.get(key);
  if (existing) return existing;
  const p = fn().finally(() => inflight.delete(key));
  inflight.set(key, p);
  return p;
}

let calls = 0;
async function dbCall() {
  calls++;
  await new Promise((r) => setTimeout(r, 50));
  return 42;
}

await Promise.all(Array.from({ length: 20 }, () => singleflight("k", dbCall)));
console.log({ calls });

