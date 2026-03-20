# Example 1 — Event replayability (offset log + consumer checkpoints + reset)

## Run
```bash
pnpm install
pnpm dev
```

Agent (appends events, commits a checkpoint, resets, and replays):
```bash
pnpm agent:run -- --baseUrl http://localhost:3000
```

## Files to start with
- `lib/eventLog.ts`
- `app/api/events/read/route.ts`
- `app/api/consumer/reset/route.ts`

