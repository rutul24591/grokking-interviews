# Example 1 — Responsive variants + DPR + immutable caching

## Run
```bash
pnpm install
pnpm dev
```

Agent (ETag / 304 check):
```bash
pnpm agent:run -- --baseUrl http://localhost:3000
```

## Files to start with
- `app/api/media/hero/route.ts`
- `lib/media.ts`

