# Example 1 — Durability modes (memory ack vs WAL fsync) + crash + replay

## Run
```bash
pnpm install
pnpm dev
```

Agent (writes one non-durable entry and one durable entry, simulates crash, replays, and asserts only durable survives):
```bash
pnpm agent:run -- --baseUrl http://localhost:3000
```

## Files to start with
- `lib/durableLog.ts`
- `app/api/log/append/route.ts`
- `app/api/log/replay/route.ts`

