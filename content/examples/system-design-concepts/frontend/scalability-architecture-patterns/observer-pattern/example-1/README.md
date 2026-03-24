## Observer Pattern — Example 1: Observable store + `useSyncExternalStore`

This example shows the **Observer pattern** as a production-friendly primitive:
- an observable value (subject)
- subscribers (observers)
- safe React integration via `useSyncExternalStore` (avoids tearing)

### Run
```bash
pnpm i
pnpm dev
```

Open `http://localhost:3000`.

