# Example 1 — Chaos Lab (Next.js control plane + Node agent)

## What it shows
- A realistic chaos-testing loop: **hypothesis → inject → observe → stop → report**.
- Deterministic **blast radius** (percentage of requests impacted).
- A “target service” endpoint that can simulate **latency**, **errors**, or **timeouts**.
- Rolling-window **steady state metrics** (error rate, p50/p95 latency).
- A Node **agent** that generates load and enforces guardrails.

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

### 2) Run an experiment with the agent (new terminal)
```bash
pnpm agent:run -- \
  --baseUrl http://localhost:3000 \
  --durationMs 30000 \
  --concurrency 40 \
  --blastPct 20 \
  --fault latency \
  --latencyMs 250 \
  --maxErrorRate 0.05 \
  --maxP95Ms 350
```

Try other failure modes:
```bash
pnpm agent:run -- --fault error --errorStatus 503
pnpm agent:run -- --fault timeout --timeoutMs 2000
```

## Files to start with
- `app/page.tsx` (UI)
- `app/api/target/route.ts` (fault injection + metrics)
- `app/api/experiments/*` (experiment lifecycle)
- `src/agent/run.ts` (load generator + guardrails + report)

