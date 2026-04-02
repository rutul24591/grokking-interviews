# Example 1 — SLO Lab (Next.js control plane + simulated target + agent)

## What it shows
- An SLO config (objective + latency threshold + “bad status” cutoff).
- A simulated `/api/target` endpoint that produces latency + 5xx outcomes.
- Rolling-window **error budget** and **burn rate** calculations.
- Multi-window alerting (fast + slow) and a simple “release freeze” signal.
- A Node agent that generates load, injects an “incident”, and writes a report JSON artifact.

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
pnpm agent:run -- \
  --baseUrl http://localhost:3000 \
  --durationMs 60000 \
  --concurrency 30 \
  --baselineErrorRate 0.002 \
  --incidentErrorRate 0.03 \
  --incidentAtMs 20000
```

## Key endpoints
- `GET/POST /api/config` (SLO + simulation behavior config)
- `GET /api/target` (simulated traffic; server records SLI events)
- `GET /api/report` (budget + burn + alert evaluation)
- `POST /api/reset` (clear telemetry for a fresh run)

