# Example 1 — Traffic management (admission control + load shedding + priorities)

## Run
```bash
pnpm install
pnpm dev
```

Agent (saturates low-priority requests, expects shedding; then confirms high-priority requests still complete):
```bash
pnpm agent:run -- --baseUrl http://localhost:3000
```

## Files to start with
- `lib/semaphore.ts`
- `app/api/work/route.ts`

