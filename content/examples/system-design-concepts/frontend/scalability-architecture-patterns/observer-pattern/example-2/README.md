## Observer Pattern — Example 2: Batched notifications (avoid update storms)

This example focuses on a common optimization: **batching** notifications so multiple synchronous updates only notify observers once per tick.

### Run
```bash
pnpm i
pnpm dev
```

