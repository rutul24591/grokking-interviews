## PWA — Example 1: Install prompt + manifest + minimal service worker

### What it demonstrates
- `manifest.webmanifest` for installability
- `beforeinstallprompt` handling and an “Install app” button
- Service worker that precaches `"/offline"` and uses it as a navigation fallback

### Run
```bash
pnpm i
pnpm build
pnpm start
```

Open `http://localhost:3000`.

### Verify offline
1. DevTools → Application → Service Workers: confirm `sw.js` is registered.
2. DevTools → Network → Offline.
3. Reload the page and confirm it falls back to `"/offline"`.

### Notes
- Using `pnpm start` (not `pnpm dev`) makes service worker behavior easier to reason about (less HMR interference).

