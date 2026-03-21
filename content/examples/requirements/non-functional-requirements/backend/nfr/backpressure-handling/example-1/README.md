# Example 1 — Bounded queue + 429 backpressure

## Run
```bash
pnpm install
pnpm dev
```

Agent (load submits + asserts 429 occurs):
```bash
pnpm agent:run -- --baseUrl http://localhost:3000
```

## Files to start with
- `lib/workQueue.ts`
- `app/api/work/route.ts`

