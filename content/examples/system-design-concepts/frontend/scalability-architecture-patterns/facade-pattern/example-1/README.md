## Facade Pattern — Example 1: BFF “dashboard” facade endpoint

This example demonstrates Facade in a frontend system:
- the UI calls a single endpoint: `/api/dashboard`
- the facade aggregates multiple “upstream” calls (profile, feed, billing)
- it handles partial failures and timeouts

### Run
```bash
pnpm i
pnpm dev
```

Open `http://localhost:3000` and refresh a few times (upstreams fail randomly).

