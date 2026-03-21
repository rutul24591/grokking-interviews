import { LruCache } from "./lru";

const cache = new LruCache<Buffer>({ maxBytes: 1024, ttlMs: 10_000 });
cache.set("a", Buffer.alloc(600), 600);
cache.set("b", Buffer.alloc(600), 600);

console.log({ size: cache.size, bytes: cache.bytes, hasA: Boolean(cache.get("a")), hasB: Boolean(cache.get("b")) });

