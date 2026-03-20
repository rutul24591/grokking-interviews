# Example 3 — Islands Pitfall: Large Props vs Id-only

## Run it (after copy-paste)
```bash
pnpm install
pnpm dev
```

Compare:
- `http://localhost:3000/?mode=big`
- `http://localhost:3000/?mode=id`

Both work, but `mode=id` avoids embedding large serialized objects into the initial HTML/RSC payload.

