import { MemoryBreaker } from "./breaker";

const breaker = new MemoryBreaker({ maxHeapUsedBytes: 32 * 1024 * 1024, coolDownMs: 2000 });

let cached = 0;
for (let i = 0; i < 200; i++) {
  // Simulate allocations
  const buf = Buffer.alloc(256 * 1024);
  if (breaker.canCache()) {
    // pretend to cache the buffer (do not actually retain to keep demo stable)
    cached++;
  }
  if (i % 25 === 0) {
    const m = process.memoryUsage();
    console.log({ i, heapUsedMB: Math.round(m.heapUsed / 1024 / 1024), cached });
  }
  // Drop reference each iteration; in real code the cache would retain.
  void buf;
}

