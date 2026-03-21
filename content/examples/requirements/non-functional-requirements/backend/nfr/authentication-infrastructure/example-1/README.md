# Example 1 — Opaque tokens + introspection caching + revocation

## Run
```bash
pnpm install
pnpm dev
```

Agent:
```bash
pnpm agent:run -- --baseUrl http://localhost:3000
```

## Files to start with
- `lib/tokens.ts`
- `lib/introspectionCache.ts`
- `app/api/resource/route.ts`

