# Why migrations are the real lock-in problem

The biggest cost of lock-in is usually **operational**:
- data size and transfer time,
- correctness verification,
- handling tail traffic and retries,
- and executing cutover safely.

This example illustrates a practical, production-oriented sequence:

## 1) Dual-write (minimizes divergence)
Write new changes to both stores. This reduces the amount of “tail” data you must reconcile later.

## 2) Backfill with checkpoints (resumable work)
Copy historical keys in batches and record progress (`cursor`).
Backfills must be **idempotent** — running a batch twice should be safe.

## 3) Verification (don’t cut over blind)
Use checksums (or version ids / ETags) to validate correctness before you flip reads.

## 4) Read-repair (smooth the long tail)
During cutover, prefer the new store but repair misses from the old store on-demand.

Production notes:
- Add rate limits and throttling to protect both providers.
- Use concurrency carefully (backpressure and retries).
- Keep an audit trail: what was copied, when, and with what checksum.

