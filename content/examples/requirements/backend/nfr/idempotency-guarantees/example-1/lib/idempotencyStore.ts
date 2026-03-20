type Stored<T> = { value: T; expiresAtMs: number };

function nowMs() {
  return Date.now();
}

export class IdempotencyStore<T> {
  private results = new Map<string, Stored<T>>();
  private inflight = new Map<string, Promise<T>>();

  constructor(private readonly ttlMs: number) {}

  private gc() {
    const n = nowMs();
    for (const [k, v] of this.results.entries()) {
      if (v.expiresAtMs <= n) this.results.delete(k);
    }
  }

  async getOrCreate(key: string, compute: () => Promise<T>): Promise<{ value: T; replayed: boolean }> {
    this.gc();

    const existing = this.results.get(key);
    if (existing && existing.expiresAtMs > nowMs()) return { value: existing.value, replayed: true };

    const inFlight = this.inflight.get(key);
    if (inFlight) {
      const value = await inFlight;
      return { value, replayed: true };
    }

    const promise = (async () => {
      try {
        const value = await compute();
        this.results.set(key, { value, expiresAtMs: nowMs() + this.ttlMs });
        return value;
      } finally {
        this.inflight.delete(key);
      }
    })();

    this.inflight.set(key, promise);
    const value = await promise;
    return { value, replayed: false };
  }
}

