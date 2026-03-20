# Example 1 — Progressive comment form (works with and without JS)

## What it shows
- HTML-first form that works without JS (PRG redirect).
- Client-side enhancement: inline validation + fetch submit + optimistic updates.
- Cursor pagination that degrades to a “Load more” link.

## Prereqs
- Node.js 20+ recommended (Node 18+ should work).
- `pnpm` installed.

## Run
```bash
pnpm install
pnpm dev
```
Open `http://localhost:3000`.

Optional agent:
```bash
pnpm agent:run -- --baseUrl http://localhost:3000 --count 5
```

## Files to start with
- `app/page.tsx` (baseline + enhanced behavior)
- `app/api/comments/route.ts` (POST redirects or JSON; GET paginates)

