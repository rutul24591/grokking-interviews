## Publish-Subscribe Pattern — Example 1: Browser `BroadcastChannel` (tab-to-tab)

This example demonstrates **pub/sub** in a frontend-friendly way:
- publishers emit messages to a channel
- subscribers listen by topic (or wildcard)
- multiple browser tabs act like independent services

### Run
```bash
pnpm i
pnpm dev
```

Open two tabs at `http://localhost:3000` and publish messages from one tab; the other receives them.

