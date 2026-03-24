## Module Pattern — Example 3: Request-scoped module via `AsyncLocalStorage`

This example demonstrates an advanced pattern for Node-based SSR/BFF code:
- store per-request state in `AsyncLocalStorage`
- expose a module API that reads from the request context

### Run
```bash
pnpm i
pnpm start
```

