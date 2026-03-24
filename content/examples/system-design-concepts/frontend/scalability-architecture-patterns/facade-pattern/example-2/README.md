## Facade Pattern — Example 2: Caching policy (stale-while-revalidate)

This Node.js example demonstrates a common facade optimization:
- cache aggregated results for a short TTL
- serve stale data while refreshing in the background

### Run
```bash
pnpm i
pnpm start
```

