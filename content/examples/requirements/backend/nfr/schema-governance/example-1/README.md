# Example 1 — Schema governance (registry + backward compatibility checks)

## Run
```bash
pnpm install
pnpm dev
```

Agent (registers v1/v2, then tries an incompatible change and expects 409):
```bash
pnpm agent:run -- --baseUrl http://localhost:3000
```

## Files to start with
- `lib/schemaRegistry.ts`
- `app/api/schema/register/route.ts`

