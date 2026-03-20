# Example 1 — Offline support via Service Worker (SWR cache + offline fallback)

## Run
```bash
pnpm install
pnpm dev
```

Agent (API smoke):
```bash
pnpm agent:run -- --baseUrl http://localhost:3000
```

## Files to start with
- `public/sw.js`
- `components/SwRegister.tsx`
- `app/api/notes/route.ts`

