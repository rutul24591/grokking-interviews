# Example 1 — Trace Lab (Next.js + traceparent propagation + Node agent)

## What it shows
- W3C `traceparent` parsing/formatting.
- Multi-hop span creation with parent/child relationships.
- Querying spans by `traceId` and rendering a waterfall view.

## Prereqs
- Node.js 20+ recommended (Node 18+ should work).
- `pnpm` installed.

## Run
### 1) Start the app
```bash
pnpm install
pnpm dev
```
Open `http://localhost:3000`.

### 2) Run the agent (new terminal)
```bash
pnpm agent:run -- --baseUrl http://localhost:3000 --runs 10
```

## Files to start with
- `lib/trace.ts` (traceparent)
- `app/api/request/route.ts` and `app/api/hops/*` (propagation + spans)
- `app/api/spans/route.ts` (query)
- `src/agent/run.ts` (validation runner)

