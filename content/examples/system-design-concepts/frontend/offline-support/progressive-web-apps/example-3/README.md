## PWA — Example 3: Service worker update UX (waiting → activate → reload)

### Run
```bash
pnpm i
pnpm build
pnpm start
```

### Simulate an update
- Edit `public/sw.js` and change `VERSION` (e.g. from `updates-v1` → `updates-v2`).
- Refresh once: the new SW should become **waiting**.
- Click “Activate update” to call `skipWaiting`, then the page reloads on `controllerchange`.

