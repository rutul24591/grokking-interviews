## Offline-first — Example 1: IndexedDB + outbox + idempotent sync API (Next.js)

### Run
```bash
pnpm i
pnpm build
pnpm start
```

Open `http://localhost:3000`.

### Demo steps
1. Create a new doc, edit it, click “Save locally (enqueue)”.
2. Turn on DevTools → Network → Offline.
3. Save a few more times (outbox grows).
4. Turn network back on and click “Sync outbox”.

### What to observe
- Local writes succeed without network (IndexedDB).
- Sync uses `idempotencyKey` and `baseServerVersion`.
- Conflicts are detected (HTTP 409) and surfaced as manual decisions.

