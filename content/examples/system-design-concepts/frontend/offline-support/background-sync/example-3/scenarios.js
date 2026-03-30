export const baseTimeMs = Date.UTC(2026, 2, 30, 10, 0, 0);

export const scenarios = [
  {
    name: "duplicate replay in dedupe window",
    ownerId: "tab-a",
    queue: [
      { mutationId: "m-1", idempotencyKey: "idem-1", entityId: "order-1", createdAtMs: baseTimeMs + 0 },
      { mutationId: "m-1-retry", idempotencyKey: "idem-1", entityId: "order-1", createdAtMs: baseTimeMs + 10_000 }
    ],
    expected: "The second delivery should be deduped by the server store."
  },
  {
    name: "partial success then retry",
    ownerId: "tab-a",
    queue: [
      {
        mutationId: "m-2",
        idempotencyKey: "idem-2",
        entityId: "order-2",
        createdAtMs: baseTimeMs + 20_000,
        serverCommittedButClientTimedOut: true
      },
      { mutationId: "m-2-retry", idempotencyKey: "idem-2", entityId: "order-2", createdAtMs: baseTimeMs + 50_000 }
    ],
    expected: "The retry must not duplicate the write after a client-visible timeout."
  },
  {
    name: "out of order replay attempts",
    ownerId: "tab-a",
    queue: [
      { mutationId: "m-4", idempotencyKey: "idem-4", entityId: "draft-7", createdAtMs: baseTimeMs + 90_000, sequence: 2 },
      { mutationId: "m-3", idempotencyKey: "idem-3", entityId: "draft-7", createdAtMs: baseTimeMs + 60_000, sequence: 1 }
    ],
    expected: "A mature client should detect sequence gaps and avoid replaying item 2 before item 1."
  },
  {
    name: "lease prevents two tabs draining together",
    ownerId: "tab-a",
    competingOwnerId: "tab-b",
    queue: [
      { mutationId: "m-5", idempotencyKey: "idem-5", entityId: "order-5", createdAtMs: baseTimeMs + 120_000 }
    ],
    expected: "A single leader should drain the outbox while the other tab stands down."
  },
  {
    name: "expired dedupe window causes duplicate risk",
    ownerId: "tab-a",
    queue: [
      { mutationId: "m-6", idempotencyKey: "idem-6", entityId: "order-6", createdAtMs: baseTimeMs + 130_000 },
      {
        mutationId: "m-6-late-retry",
        idempotencyKey: "idem-6",
        entityId: "order-6",
        createdAtMs: baseTimeMs + 130_000 + 10 * 60_000,
        expireServerRecordBeforeReplay: true
      }
    ],
    expected: "If the server forgets the key too early, a late retry can duplicate the effect."
  }
];
