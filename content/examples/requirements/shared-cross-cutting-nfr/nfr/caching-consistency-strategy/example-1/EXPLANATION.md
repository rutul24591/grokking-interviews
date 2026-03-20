This is a runnable “Cache Consistency Lab”:

- A tiny “DB” with versioned records.
- A cache layer with TTL and two strategies:
  - **invalidation** on write
  - **versioned keys** (cache key includes version)
- Optional stampede protection via **singleflight**.
- A Node agent that checks read-after-write behavior under each strategy.

