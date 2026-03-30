## Service Workers — Example 1: Lifecycle + caching + message passing (Next.js)

### Run
```bash
pnpm i
pnpm build
pnpm start
```

Open `http://localhost:3000`.

### Try this
- Click “Call /api/time” repeatedly and inspect `x-sw-source` (network vs cache).
- Toggle DevTools → Network → Offline and try “Call /api/time” again (cache fallback).
- Open DevTools → Application → Service Workers to see install/activate status.

