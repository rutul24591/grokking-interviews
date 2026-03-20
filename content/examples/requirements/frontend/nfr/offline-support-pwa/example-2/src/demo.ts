type Cache<T> = { value: T; at: number } | null;

async function staleWhileRevalidate<T>(cache: Cache<T>, network: () => Promise<T>) {
  const cached = cache;
  const networkPromise = network().catch(() => null as unknown as T);
  if (cached) return { value: cached.value, source: "cache", refreshed: await networkPromise };
  const fresh = await networkPromise;
  return { value: fresh, source: "network", refreshed: null as T | null };
}

let cache: Cache<{ version: number }> = { value: { version: 1 }, at: Date.now() };
let networkUp = true;

async function network() {
  if (!networkUp) throw new Error("offline");
  await new Promise((r) => setTimeout(r, 50));
  const next = { version: (cache?.value.version || 1) + 1 };
  cache = { value: next, at: Date.now() };
  return next;
}

const a = await staleWhileRevalidate(cache, network);
networkUp = false;
const b = await staleWhileRevalidate(cache, network);

console.log(JSON.stringify({ a, b }, null, 2));

