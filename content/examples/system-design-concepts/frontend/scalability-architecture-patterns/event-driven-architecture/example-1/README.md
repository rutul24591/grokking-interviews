## Event-Driven Architecture (Frontend) — Example 1: SSE domain events + UI projection

This example shows a small event producer (Node.js) that publishes **domain events** over **SSE (Server-Sent Events)** and a Next.js UI that:
- connects/reconnects safely
- validates event payloads (schema first)
- builds a simple in-memory **read model** (“projection”) from an append-only event stream

### Run

Terminal 1 (event server):
```bash
cd server
pnpm i
pnpm dev
```

Terminal 2 (web):
```bash
cd web
pnpm i
pnpm dev
```

Open `http://localhost:3000`.

### Notes
- SSE is **server → client** only; clients publish events via `POST /publish`.
- This is intentionally **in-memory** (no durability). Example 2/3 cover reliability and evolution concerns.

