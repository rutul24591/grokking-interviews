## Network Status Detection — Example 3: Circuit breaker + request queueing (Next.js)

### Run
```bash
pnpm i
pnpm build
pnpm start
```

### Try this
- Increase `failRate` and click “Call endpoint” until the breaker opens (fast failures).
- While open, click “Queue call”, then wait for half-open and click “Drain queue”.

