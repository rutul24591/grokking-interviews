# Example 2 — On-Demand Revalidation (revalidateTag)

## What it shows
- Cached content tagged as `content`.
- Publishing changes the origin, but the page stays stale until revalidated.
- `/api/revalidate` triggers `revalidateTag("content")`.

## Run it (after copy-paste)
```bash
pnpm install
pnpm build
pnpm start
```

Then:
- Open `http://localhost:3000`
- Click **Publish**
- Refresh (still stale)
- Click **Revalidate**
- Refresh (now updated)

