# Example 1 — Database selection strategy (scored recommendation + reasoning)

## Run
```bash
pnpm install
pnpm dev
```

Agent (sends two workloads and asserts different recommendations):
```bash
pnpm agent:run -- --baseUrl http://localhost:3000
```

## Files to start with
- `lib/recommender.ts`
- `app/api/recommend/route.ts`

