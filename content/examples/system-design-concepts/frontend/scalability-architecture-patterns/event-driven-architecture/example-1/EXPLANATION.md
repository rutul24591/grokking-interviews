## What this demonstrates

**Event-driven architecture (EDA)** means components communicate by emitting and reacting to **events** (facts that happened), rather than tightly coupled request/response chains.

In frontend systems design, EDA commonly appears as:
- **Server → client** event streams (SSE/WebSocket) for realtime UI
- **Client-side event buses** for decoupling feature modules
- **Event sourcing-ish projections** on the client (derive UI state from a stream)

This example focuses on a practical slice:

1) A Node.js service emits **domain events** and keeps a small in-memory history.
2) The browser uses **SSE** to subscribe.
3) The UI builds a **projection**: a read model derived from events.
4) Events are **schema-validated** at the boundary (don’t trust the wire).

## Key design points

### 1) Envelope + schema validation
Events are wrapped in an envelope (`id`, `ts`, `type`, `v`, `data`). This gives:
- **Idempotency hooks** (`id`)
- **Ordering & debugging** (`ts`)
- **Routing** (`type`)
- **Evolution** (`v` + schema versioning)

The client validates the envelope with `zod` before applying it to state.

### 2) Projection instead of “push state”
The server does not send “the full UI state”. It sends facts, and the client updates:
- counters
- last event
- a small activity log

This models how large systems build **read models** for different consumers.

### 3) Reconnect + replay window
SSE supports automatic reconnect. The server additionally keeps a short history and can replay events after a reconnect using `Last-Event-ID`.

In production, you’d likely:
- persist to a log (Kafka / Kinesis / DB outbox)
- use **consumer offsets**
- implement **backpressure** and bounded history per client

## Trade-offs
- SSE is simpler than WebSockets for many “broadcast” cases, but it’s one-way.
- Client projections are fast and flexible, but require careful idempotency and versioning discipline.
- In-memory event history is not durable; it’s just a teaching scaffold.

