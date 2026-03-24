import { randomUUID } from "node:crypto";

export type DemoSingleton = {
  id: string;
  startedAt: number;
  requests: number;
};

declare global {
  // eslint-disable-next-line no-var
  var __SD_SINGLETON_DEMO__: DemoSingleton | undefined;
}

export function getDemoSingleton(): DemoSingleton {
  const existing = globalThis.__SD_SINGLETON_DEMO__;
  if (existing) return existing;
  const created: DemoSingleton = { id: randomUUID(), startedAt: Date.now(), requests: 0 };
  globalThis.__SD_SINGLETON_DEMO__ = created;
  return created;
}

