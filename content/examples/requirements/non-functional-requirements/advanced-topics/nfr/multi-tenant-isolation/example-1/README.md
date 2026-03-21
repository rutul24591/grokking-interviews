# Example 1 — Tenant Lab (Next.js control plane + simulated service + traffic agent)

## What it shows
- Tenant-scoped routing via `x-tenant-id`
- Shared-pool vs bulkhead isolation (noisy neighbor demo)
- Per-tenant token-bucket rate limiting and per-tenant concurrency limits
- Per-tenant “daily unit budget” accounting
- A traffic agent that generates a noisy-neighbor incident and writes a report artifact

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

### 2) Run the traffic agent (new terminal)
Shared pool (expect noisy neighbor impact):
```bash
pnpm agent:run -- --baseUrl http://localhost:3000 --mode shared
```

Bulkheads (expect isolation for the low-traffic tenant):
```bash
pnpm agent:run -- --baseUrl http://localhost:3000 --mode bulkhead
```

## Endpoints
- `GET/POST /api/config` (tenants + limits + isolation mode)
- `GET /api/work` (simulated tenant-scoped work)
- `GET /api/report` (per-tenant metrics + reject reasons)
- `POST /api/reset` (reset telemetry + budgets)

