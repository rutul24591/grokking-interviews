# Example 1 — A11y Audit Console (Next.js + Node “CI agent”)

## What it shows
- Server-side accessibility audits with **axe + jsdom** (no browser needed).
- Capturing a **baseline** and enforcing a **no-regression** budget.
- A Node agent that runs all audits and can fail CI.

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
pnpm agent:run -- --baseUrl http://localhost:3000 --maxNewViolations 0
```

## Files to start with
- `app/page.tsx` (UI)
- `app/api/audit/route.ts` (axe audit endpoint)
- `app/api/baseline/route.ts` (baseline capture)
- `src/agent/run.ts` (CI-style runner)

