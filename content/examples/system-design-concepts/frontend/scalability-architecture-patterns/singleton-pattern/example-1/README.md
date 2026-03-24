## Singleton Pattern — Example 1: Safe singleton in Next.js (hot reload / server runtime)

This example shows a practical use of Singleton in a backend-for-frontend runtime:
- a single in-process instance (cached on `globalThis`)
- a route handler that uses it
- a UI that calls the route repeatedly

### Run
```bash
pnpm i
pnpm dev
```

Open `http://localhost:3000` and click “Ping” multiple times.

