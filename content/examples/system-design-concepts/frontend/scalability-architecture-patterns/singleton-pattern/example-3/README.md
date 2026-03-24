## Singleton Pattern — Example 3: One-per-process (not global)

This example shows a common edge case: a “singleton” is scoped to a **single process**.
If you scale out (multi-process, multiple pods), you’ll have many instances.

### Run
```bash
pnpm i
pnpm start
```

