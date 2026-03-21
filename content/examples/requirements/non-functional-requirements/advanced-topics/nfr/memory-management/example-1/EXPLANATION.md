This is a runnable “Memory Lab” demo that helps you *see* memory-management trade-offs:

- A request handler that allocates data per request.
- Three modes:
  - **leaky**: stores allocations in an unbounded Map (classic server leak pattern).
  - **lru**: stores allocations in a bounded LRU cache (size + TTL).
  - **none**: does not retain (baseline).
- An endpoint that exposes `process.memoryUsage()` and cache sizes.
- A Node agent that generates load and detects runaway growth.

Interview mapping:
1) Why unbounded caches leak and how to cap them (LRU / LFU / TTL / admission control).
2) Why “memory usage” is multi-dimensional (RSS vs heap vs external buffers).
3) How to add guardrails: memory breakers, backpressure, and safe fallbacks.

