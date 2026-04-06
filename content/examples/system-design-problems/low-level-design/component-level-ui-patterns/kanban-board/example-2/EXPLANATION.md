# Kanban Board — Edge Cases & Advanced Scenarios

This document covers two advanced kanban board scenarios that interviewers ask as the deepest follow-ups: CRDT-based conflict resolution for concurrent card moves, and offline drag recovery with WebSocket disconnect reconciliation.

---

## Edge Case 1: Concurrent Move Resolution (CRDT)

### The problem

In a collaborative kanban board, multiple users can manipulate the same card simultaneously:

- User A drags "Task-42" to "Done"
- User B drags "Task-42" to "Archived"
- Both operations arrive at the server at nearly the same time

With a simple last-write-wins approach, one user's work is silently lost. With no conflict resolution at all, the card could end up in two places — a corrupted state.

### Why CRDTs?

CRDTs (Conflict-free Replicated Data Types) guarantee that all replicas converge to the same state regardless of the order in which operations arrive. This is achieved through three mathematical properties:

| Property | Meaning |
|----------|---------|
| **Commutative** | `apply(A, B) === apply(B, A)` — order doesn't matter |
| **Associative** | `apply(apply(A, B), C) === apply(A, apply(B, C))` — grouping doesn't matter |
| **Idempotent** | `apply(A) === apply(apply(A))` — applying twice is the same as once |

### Vector clocks for causal ordering

Each operation carries a vector clock — a map from replica ID to logical timestamp:

```
Alice's clock after 3 operations: { alice: 3, bob: 0 }
Bob's clock after 2 operations:   { alice: 0, bob: 2 }
```

When comparing two operations:
- **Before**: All entries in clock A are <= clock B → A happened before B → B wins
- **After**: All entries in clock A are >= clock B → A happened after B → A wins
- **Concurrent**: Some entries are greater, some are lesser → CONFLICT → use tiebreaker

### Deterministic tiebreaker

When vector clocks are concurrent, we need a deterministic way to pick a winner. The resolver uses a cascade:

1. **Replica priority**: Admin > Editor > Viewer (configurable)
2. **Timestamp**: Later timestamp wins
3. **Operation ID**: Lexicographically greater ID wins (final fallback)

The critical insight: this function produces the **same result on every replica** when given the same two operations, regardless of which order they're compared. That's what makes it a valid CRDT merge.

### Idempotency

Every operation has a unique `opId`. The resolver tracks all seen operation IDs in a `Set`. If the same operation arrives twice (e.g., due to a WebSocket reconnect replay), it's a no-op. This prevents double-applying the same move.

---

## Edge Case 2: Offline Drag Recovery

### The problem

A user drags a card while their network drops (switching WiFi, entering a tunnel, laptop sleeping). The card moves on the client (optimistic UI), but the server never receives the update. When the connection returns, several things need to happen correctly.

### The solution: Queue + Reconcile + Replay

**Phase 1 — Queue (during disconnect)**:
Operations are stored in a local queue and persisted to `localStorage`. If the browser tab closes, the queue survives.

**Phase 2 — Reconcile (on reconnect)**:
Before replaying pending operations, we fetch the server's current state and compare:

| Scenario | Server state | Pending op | Resolution |
|----------|-------------|------------|------------|
| Already applied | Card is in "Done" | Move to "Done" | Discard (already reflected) |
| Server wins | Card was deleted | Move deleted card | Drop the operation |
| Client wins | Card is in "Todo" | Move to "Done" | Replay the move |
| Conflict | Card is in "Archived" | Move to "Done" | Flag for resolution |

**Phase 3 — Replay (after reconciliation)**:
Safe operations are sent to the server in order. Each one gets an acknowledgment. Unacknowledged operations retry with exponential backoff.

### Optimistic UI

The user sees the card move immediately on drop — regardless of connection status. This is the key UX principle: **the UI should never block on the network**. The recovery system works in the background to ensure consistency.

### Exponential backoff

When the server doesn't acknowledge an operation within the timeout, we retry with increasing delays:

```
Attempt 1: 1000ms
Attempt 2: 2000ms
Attempt 3: 4000ms
Attempt 4: give up → move back to pending queue for reconnect
```

This prevents hammering a slow or recovering server.

---

## Diagrams

### CRDT conflict resolution flow

```
User Alice (priority 0)           Server              User Bob (priority 1)
─────────────────                 ──────                 ─────────────────

Moves T-42 → Done
Clock: {alice: 1}
Send op ──────────────→                                Moves T-42 → Archived
                                                     Clock: {bob: 1}
                                                        Send op ──────────→

                    ← Both arrive at server →

                    Conflict detected:
                    Alice's clock {alice: 1, bob: 0}
                    Bob's clock   {alice: 0, bob: 1}
                    → Concurrent!

                    Tiebreaker:
                    1. Alice priority: 0
                       Bob priority: 1
                    → Alice wins

                    T-42 stays in "Done"

                    Broadcast result ────────→     Receives Alice's op
                    Broadcast result ───────────────────────→
                    (both clients converge to same state)
```

### Offline recovery timeline

```
t=0:     User drags card T-42 from "Todo" to "Done"
         WebSocket: connected → op sent immediately
         Server acknowledges → done ✓

t=10s:   WebSocket disconnects (network drops)
         status: "disconnected"

t=15s:   User drags T-43 from "Todo" to "In Progress"
         → Queued locally (pendingQueue: [move-T-43])
         → Persisted to localStorage
         → UI updated optimistically (user sees the move)

t=20s:   User drags T-44 from "Done" to "Archived"
         → Queued locally (pendingQueue: [move-T-43, move-T-44])

t=30s:   Browser tab closed → queue persisted in localStorage

t=35s:   Browser tab reopened → recovery.restoreQueue()
         → pendingQueue: [move-T-43, move-T-44]
         → status: "disconnected" (WebSocket not yet reconnected)

t=40s:   WebSocket reconnects → recovery.onReconnect()
         → Fetch server snapshot
         → Reconcile:
             T-43: Server already has it in "In Progress" → DISCARD (already applied)
             T-44: Server still has it in "Done" → REPLAY
         → Send move-T-44
         → Server acknowledges
         → status: "connected", pendingQueue: []

Final state: Both client and server agree on all card positions.
```

### Reconciliation decision tree

```
Pending operation: Move card X to column Y
         │
         ▼
    ┌─────────────┐
    │ Does card X │
    │ exist on    │
    │ server?     │
    └──┬──────┬───┘
       │      │
      NO     YES
       │      │
       ▼      ▼
  ┌─────────┐ ┌──────────────────────────────┐
  │ Server  │ │ Is card X already in column  │
  │ wins —  │ │ Y at position Z on server?   │
  │ drop op │ └──┬───────────────────┬───────┘
  └─────────┘    │                   │
                YES                  NO
                 │                   │
                 ▼                   ▼
          ┌─────────────┐    ┌─────────────────────┐
          │ Discard —   │    │ Is card X in a       │
          │ already     │    │ DIFFERENT column on  │
          │ reflected   │    │ server?              │
          └─────────────┘    └──┬──────────────┬────┘
                               │              │
                              YES             NO
                               │              │
                               ▼              ▼
                        ┌─────────────┐ ┌─────────────┐
                        │ Conflict —  │ │ New card —  │
                        │ flag for    │ │ safe to     │
                        │ resolution  │ │ replay      │
                        └─────────────┘ └─────────────┘
```
