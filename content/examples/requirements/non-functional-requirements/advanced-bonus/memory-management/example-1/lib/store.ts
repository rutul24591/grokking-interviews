import { LruCache } from "./lru";

export type Mode = "none" | "leaky" | "lru";

type Store = {
  mode: Mode;
  leak: Map<string, Buffer>;
  lru: LruCache<Buffer>;
  requests: number;
  bytesAllocated: number;
};

const store: Store =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ((globalThis as any).__MEM_STORE__ as Store | undefined) ?? {
    mode: "none",
    leak: new Map(),
    lru: new LruCache<Buffer>({ maxBytes: 4 * 1024 * 1024, ttlMs: 60_000 }),
    requests: 0,
    bytesAllocated: 0,
  };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).__MEM_STORE__ = store;

export function getStore() {
  return store;
}

