# Example 1 — Micro-frontend host + versioned contract + remotes

## What it shows
- Host shell that loads a remote micro-frontend at runtime.
- Versioned host contract (`window.__MF_HOST__`) with compatibility.
- Two remotes (`v1` and `v2`) that can coexist during upgrades.

## Prereqs
- Node.js 20+ recommended (Node 18+ should work).
- `pnpm` installed.

## Run
```bash
pnpm install
pnpm dev
```
Open `http://localhost:3000` and switch between `profile-v1` and `profile-v2`.

Contract test (static check):
```bash
pnpm agent:run
```

## Files to start with
- `app/page.tsx` (host loader)
- `public/remotes/profile-v1.js` and `public/remotes/profile-v2.js` (remotes)
- `lib/host.ts` (contract + event bus)

