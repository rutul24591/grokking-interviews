## Background Sync — Example 1: Outbox + SW drain (Next.js)

### Run
```bash
pnpm i
pnpm build
pnpm start
```

Open `http://localhost:3000`.

### Try this
- Click “Queue mutation” a few times.
- Toggle DevTools → Network → Offline to simulate being offline.
- Use “Drain via service worker” or “Drain via page (fallback)”.

