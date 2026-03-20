Example 1 demonstrates **time-based ISR** (revalidate after N seconds).

Setup:
- A Next.js page fetches “published content” from a separate Node.js (Express) content API.
- The page is cached and revalidated every `10s`.

What to observe (in production mode: `pnpm build && pnpm start`):
- After you “publish” new content, the site keeps serving the old HTML/data until the revalidate window expires.
- After expiry, the next request triggers regeneration and future requests see the new version.

