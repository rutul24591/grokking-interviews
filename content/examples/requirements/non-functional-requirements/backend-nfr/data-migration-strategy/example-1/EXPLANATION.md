# What this example covers

This example implements a realistic **online migration** pattern:

- **Legacy schema**: `fullName`
- **New schema**: `firstName` + `lastName`

It supports phased rollout:

1. **legacy** — write/read legacy only
2. **dual_write** — write both, read legacy (safe)
3. **read_new** — read new with legacy fallback (reduce risk)
4. **cutover** — new only (after confidence)

It also includes an **idempotent backfill** endpoint to migrate old rows.

## Real-world gotchas

- Dual writes can diverge; prefer **single writer + CDC** when possible.
- Backfills must be **rate-limited** and **checkpointed**.
- Cutovers need a rollback plan (read fallback, or feature flag to revert quickly).

