import { createLeaderLease } from "./leader.js";
import { createReplayStore } from "./replay-store.js";
import { baseTimeMs, scenarios } from "./scenarios.js";

function formatTime(ms) {
  return new Date(ms).toISOString().slice(11, 19);
}

function processMutation({ store, mutation, deliveredOrder, blockedReason }) {
  const envelope = {
    deliveredOrder,
    mutationId: mutation.mutationId,
    idempotencyKey: mutation.idempotencyKey,
    entityId: mutation.entityId
  };

  if (blockedReason) {
    return {
      ...envelope,
      outcome: "blocked",
      note: blockedReason
    };
  }

  if (mutation.serverCommittedButClientTimedOut) {
    store.apply({
      idempotencyKey: mutation.idempotencyKey,
      nowMs: mutation.createdAtMs,
      effect: () => ({
        entityId: mutation.entityId,
        committedAt: formatTime(mutation.createdAtMs),
        source: "initial-attempt"
      })
    });

    return {
      ...envelope,
      outcome: "client-timeout-after-server-commit",
      note: "The server committed the write, but the client retried because the acknowledgment was lost."
    };
  }

  const result = store.apply({
    idempotencyKey: mutation.idempotencyKey,
    nowMs: mutation.createdAtMs,
    effect: () => ({
      entityId: mutation.entityId,
      committedAt: formatTime(mutation.createdAtMs),
      source: mutation.mutationId
    })
  });

  return {
    ...envelope,
    outcome: result.status,
    note:
      result.status === "deduped"
        ? `Reused first commit at ${formatTime(result.firstAppliedAtMs)}`
        : `Applied at ${formatTime(result.firstAppliedAtMs)}`
  };
}

function runScenario(scenario) {
  const store = createReplayStore();
  const lease = createLeaderLease();
  const timeline = [];
  let highestSequenceSeen = 0;

  const ownerAttempt = lease.claim(scenario.ownerId);
  if (!ownerAttempt.acquired) {
    timeline.push({
      deliveredOrder: 0,
      mutationId: "owner-blocked",
      idempotencyKey: "n/a",
      entityId: "n/a",
      outcome: "blocked",
      note: `${scenario.ownerId} could not acquire lease because ${ownerAttempt.ownerId} already owns it`
    });
    return { timeline, storeSnapshot: store.snapshot() };
  }

  if (scenario.competingOwnerId) {
    const competingAttempt = lease.claim(scenario.competingOwnerId);
    timeline.push({
      deliveredOrder: 0,
      mutationId: "lease-check",
      idempotencyKey: "n/a",
      entityId: "n/a",
      outcome: competingAttempt.acquired ? "leader-elected" : "blocked",
      note: competingAttempt.acquired
        ? `${scenario.competingOwnerId} unexpectedly took over the drain lease`
        : `${scenario.competingOwnerId} probes for drain ownership and stands down`
    });
  }

  const pendingBySequence = new Map();

  function flushPending() {
    while (pendingBySequence.has(highestSequenceSeen + 1)) {
      const nextMutation = pendingBySequence.get(highestSequenceSeen + 1);
      pendingBySequence.delete(highestSequenceSeen + 1);
      highestSequenceSeen += 1;
      timeline.push(
        processMutation({
          store,
          mutation: nextMutation,
          deliveredOrder: `${nextMutation.deliveredOrder}r`
        })
      );
    }
  }

  scenario.queue.forEach((mutation, index) => {
    if (mutation.expireServerRecordBeforeReplay) {
      store.forceExpire(mutation.idempotencyKey, baseTimeMs - 10 * 60_000);
    }

    let blockedReason = null;
    const deliveredOrder = index + 1;
    if (typeof mutation.sequence === "number") {
      if (mutation.sequence > highestSequenceSeen + 1) {
        blockedReason = `Sequence gap detected. Expected ${highestSequenceSeen + 1}, got ${mutation.sequence}.`;
        pendingBySequence.set(mutation.sequence, { ...mutation, deliveredOrder });
      } else {
        highestSequenceSeen = Math.max(highestSequenceSeen, mutation.sequence);
      }
    }

    timeline.push(
      processMutation({
        store,
        mutation,
        deliveredOrder,
        blockedReason
      })
    );

    if (!blockedReason) {
      flushPending();
    }
  });

  lease.release(scenario.ownerId);
  if (scenario.competingOwnerId) {
    lease.release(scenario.competingOwnerId);
  }

  return { timeline, storeSnapshot: store.snapshot() };
}

for (const scenario of scenarios) {
  const result = runScenario(scenario);
  console.log(`\n=== ${scenario.name} ===`);
  console.log(`Expectation: ${scenario.expected}`);
  console.table(result.timeline);
  console.log("Replay store:", JSON.stringify(result.storeSnapshot, null, 2));
}
