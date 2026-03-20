import { setTimeout as delay } from "node:timers/promises";

export async function withRetries<T>(fn: () => Promise<T>, retries: number) {
  let last: unknown;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (e) {
      last = e;
      if (attempt === retries) break;
      await delay(20 * (attempt + 1));
    }
  }
  throw last;
}

