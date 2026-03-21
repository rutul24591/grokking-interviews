# Example 1 — Leader election + BroadcastChannel sync

## Run
```bash
pnpm install
pnpm dev
```

Open the app in multiple tabs; only one tab becomes the polling leader.

Agent:
```bash
pnpm agent:run -- --baseUrl http://localhost:3000
```

## Files to start with
- `lib/multitab/lease.ts`
- `lib/multitab/channel.ts`
- `app/page.tsx`

