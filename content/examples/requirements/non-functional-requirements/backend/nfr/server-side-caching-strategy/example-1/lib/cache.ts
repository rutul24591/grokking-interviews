import { setTimeout as delay } from "node:timers/promises";

type Entry<T> = { value: T; expiresAtMs: number; createdAtMs: number };

export class Cache<T> {
  private data = new Map<string, Entry<T>>();
  private inflight = new Map<string, Promise<T>>();
  computeCount = 0;

  constructor(private readonly ttlMs: number) {}

  flush() {
    this.data.clear();
    this.inflight.clear();
    this.computeCount = 0;
  }

  private getFresh(key: string) {
    const e = this.data.get(key);
    if (!e) return null;
    if (Date.now() >= e.expiresAtMs) {
      this.data.delete(key);
      return null;
    }
    return e;
  }

  async getOrCompute(key: string, compute: () => Promise<T>) {
    const fresh = this.getFresh(key);
    if (fresh) {
      return { value: fresh.value, cache: { hit: true, ageMs: Date.now() - fresh.createdAtMs, ttlMs: this.ttlMs } };
    }

    const pending = this.inflight.get(key);
    if (pending) {
      const value = await pending;
      return { value, cache: { hit: true, coalesced: true, ttlMs: this.ttlMs } as any };
    }

    const promise = (async () => {
      try {
        this.computeCount++;
        const value = await compute();
        this.data.set(key, { value, createdAtMs: Date.now(), expiresAtMs: Date.now() + this.ttlMs });
        return value;
      } finally {
        this.inflight.delete(key);
      }
    })();

    this.inflight.set(key, promise);
    const value = await promise;
    return { value, cache: { hit: false, ttlMs: this.ttlMs } };
  }
}

export const profileCache = new Cache<{ userId: string; displayName: string }>(5_000);

export async function loadProfile(userId: string) {
  await delay(60);
  return { userId, displayName: `User ${userId}` };
}

