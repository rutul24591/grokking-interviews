## Network Status Detection — Example 1: Connectivity oracle (Next.js)

### Run
```bash
pnpm i
pnpm build
pnpm start
```

Open `http://localhost:3000`.

### What to try
- Switch heartbeat mode to **slow** or **fail** to see `online → degraded` transitions.
- Use DevTools → Network → Offline to see `offline` (from `navigator.onLine`).

