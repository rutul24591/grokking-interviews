# Example 1 — Lazy Compute Lab (dynamic imports)

## What it shows
- Keeping “heavy” code behind a feature boundary using `import()` so it’s only loaded when needed.
- A simple invariant: heavy module load count stays `0` until the heavy path is hit.

## Run
```bash
pnpm install
pnpm dev
```

Agent:
```bash
pnpm agent:run -- --baseUrl http://localhost:3000
```

