## Token Refresh — Example 2: Singleflight refresh (focused)

This Node.js script demonstrates singleflight:
- many callers request “refresh”
- only one refresh runs, others await the same promise

### Run
```bash
pnpm i
pnpm start
```

