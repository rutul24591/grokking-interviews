## Observer Pattern — Example 3: Unsubscribe hygiene (avoid leaks)

This is a Node.js script that demonstrates a common edge case: observers that never unsubscribe keep objects alive and
turn into a memory leak.

### Run
```bash
pnpm i
pnpm start
```

