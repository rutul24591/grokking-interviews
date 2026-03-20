type Entry<T> = { value: T; expiresAtMs: number; refreshing: boolean };

function staleWhileRevalidate<T>(ttlMs: number, loader: () => Promise<T>) {
  let entry: Entry<T> | null = null;

  return async function get(nowMs = Date.now()): Promise<{ value: T; fromCache: boolean }> {
    if (entry && nowMs < entry.expiresAtMs) return { value: entry.value, fromCache: true };
    if (entry && !entry.refreshing) {
      entry.refreshing = true;
      loader()
        .then((v) => {
          entry = { value: v, expiresAtMs: Date.now() + ttlMs, refreshing: false };
        })
        .catch(() => {
          entry!.refreshing = false;
        });
      return { value: entry.value, fromCache: true };
    }

    const v = await loader();
    entry = { value: v, expiresAtMs: Date.now() + ttlMs, refreshing: false };
    return { value: v, fromCache: false };
  };
}

let n = 0;
const loader = async () => {
  n++;
  return "v" + n;
};

const get = staleWhileRevalidate(100, loader);

const a = await get(0);
const b = await get(50);
const c = await get(150);

console.log(JSON.stringify({ a, b, c }, null, 2));
console.log(JSON.stringify({ ok: true }, null, 2));

