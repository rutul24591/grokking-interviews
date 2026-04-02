# Example 1 — Canary Lab (Next.js control plane + simulated service + rollout agent)

## What it shows
- Deterministic canary routing using `x-user-id` hashing (sticky assignment).
- A simulated endpoint that behaves differently for baseline vs canary (latency + error rate).
- Rolling per-variant metrics (error rate, p50/p95 latency).
- Guardrails comparing canary vs baseline deltas.
- A Node agent that ramps canary percent (1% → 5% → 10% → 25% → 50%) and writes a rollout report.

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

### 2) Run the rollout agent (new terminal)
```bash
pnpm agent:run -- \
  --baseUrl http://localhost:3000 \
  --stageMs 15000 \
  --concurrency 40 \
  --ramp 1,5,10,25,50 \
  --maxErrorRateDelta 0.01 \
  --maxP95DeltaMs 80
```

To simulate a bad canary, increase canary error rate in the UI or via:
```bash
curl -s -X POST http://localhost:3000/api/config \
  -H 'content-type: application/json' \
  -d '{"routing":{"canaryPct":10},"guardrails":{"maxErrorRateDelta":0.01,"maxP95DeltaMs":80},"behavior":{"baseline":{"baseLatencyMs":80,"jitterMs":20,"tailPct":0.05,"tailLatencyMs":300,"errorRate":0.002,"errorStatus":503},"canary":{"baseLatencyMs":90,"jitterMs":25,"tailPct":0.07,"tailLatencyMs":450,"errorRate":0.03,"errorStatus":503}}}'
```

## Key endpoints
- `GET/POST /api/config`
- `GET /api/serve` (records events, returns variant + latency)
- `GET /api/report` (per-variant stats + guardrail evaluation)
- `POST /api/reset`

