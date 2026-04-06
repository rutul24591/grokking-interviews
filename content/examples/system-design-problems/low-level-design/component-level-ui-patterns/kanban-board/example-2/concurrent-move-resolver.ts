/**
 * Concurrent Move Resolver — CRDT-Based Conflict Resolution
 *
 * Edge case: Two users simultaneously drag the same card to different columns.
 * Or, one user drags card A while another user deletes card A. Or, a card is
 * moved to a column that another user just deleted.
 *
 * These are **concurrent operations** — two or more mutations on the same
 * entity that arrive at different replicas (clients/server) in different orders.
 *
 * Without conflict resolution:
 *   - User 1 moves card "Task-42" to "Done"
 *   - User 2 moves card "Task-42" to "Archived"
 *   - The server receives both → which one wins?
 *   - Last-write-wins is the simplest approach but loses User 1's intent
 *
 * CRDT (Conflict-free Replicated Data Type) approach:
 *   Instead of storing a single "current column" value, we store a history
 *   of moves as operations with vector clocks. When conflicts arise, we
 *   use a deterministic merge strategy that both replicas can apply
 *   independently and arrive at the same final state.
 *
 * Strategy:
 *   - Each card move is an operation with a vector clock
 *   - The card's state is a list of moves, not a single position
 *   - Conflicts are resolved by: (1) vector clock comparison,
 *     (2) deterministic tiebreaker (user priority, then timestamp)
 *   - The merge operation is commutative, associative, and idempotent
 */

// ─── Types ───────────────────────────────────────────────────────────────────

/** Unique identifier for a user/client */
type ReplicaId = string;

/** Unique identifier for a board column */
type ColumnId = string;

/** Unique identifier for a card */
type CardId = string;

/**
 * Vector clock — maps each replica ID to its logical timestamp.
 *
 * A vector clock V1 "happens before" V2 if:
 *   - For all replicas r: V1[r] <= V2[r]
 *   - For at least one replica r: V1[r] < V2[r]
 *
 * If neither V1 <= V2 nor V2 <= V1, the operations are concurrent (conflict).
 */
type VectorClock = Record<ReplicaId, number>;

interface MoveOperation {
  /** The card being moved */
  cardId: CardId;
  /** Source column (where the card was before the move) */
  fromColumn: ColumnId;
  /** Destination column (where the card is being moved to) */
  toColumn: ColumnId;
  /** Position index within the destination column */
  toIndex: number;
  /** Vector clock at the time of the operation */
  vectorClock: VectorClock;
  /** The replica (user/client) that initiated this move */
  replicaId: ReplicaId;
  /** Wall-clock timestamp (used as a deterministic tiebreaker) */
  timestamp: number;
  /** Unique operation ID (for idempotency checks) */
  opId: string;
}

interface CardState {
  cardId: CardId;
  /** The resolved current column of the card */
  currentColumn: ColumnId;
  /** The resolved position within the column */
  position: number;
  /** All moves applied to this card (for re-derivation) */
  moveHistory: MoveOperation[];
  /** The merged vector clock representing the card's current state */
  mergedClock: VectorClock;
}

interface ColumnState {
  id: ColumnId;
  /** Ordered list of card IDs in this column */
  cardIds: CardId[];
}

/**
 * Priority map for deterministic conflict resolution.
 * Higher priority wins when vector clocks are concurrent.
 * This could be based on user roles (admin > editor > viewer) or
 * simply a consistent ordering of replica IDs.
 */
interface ReplicaPriority {
  replicaId: ReplicaId;
  /** Lower number = higher priority (0 is highest) */
  priority: number;
}

// ─── Vector clock utilities ─────────────────────────────────────────────────

/**
 * Increment the local replica's entry in the vector clock.
 * Called before creating a new operation.
 */
function incrementClock(clock: VectorClock, replicaId: ReplicaId): VectorClock {
  return {
    ...clock,
    [replicaId]: (clock[replicaId] ?? 0) + 1,
  };
}

/**
 * Merge two vector clocks by taking the component-wise maximum.
 * This produces a clock that "knows about" everything both clocks know.
 */
function mergeClocks(a: VectorClock, b: VectorClock): VectorClock {
  const result: VectorClock = { ...a };
  for (const [replicaId, time] of Object.entries(b)) {
    result[replicaId] = Math.max(result[replicaId] ?? 0, time);
  }
  return result;
}

/**
 * Compare two vector clocks.
 * Returns:
 *   'before'    — a happens before b (a is strictly dominated by b)
 *   'after'     — a happens after b
 *   'concurrent' — neither dominates — CONFLICT
 *   'equal'     — identical clocks
 */
function compareClocks(a: VectorClock, b: VectorClock): 'before' | 'after' | 'concurrent' | 'equal' {
  const allReplicas = new Set([...Object.keys(a), ...Object.keys(b)]);

  let aHasGreater = false;
  let bHasGreater = false;

  for (const replica of allReplicas) {
    const aTime = a[replica] ?? 0;
    const bTime = b[replica] ?? 0;

    if (aTime > bTime) aHasGreater = true;
    if (bTime > aTime) bHasGreater = true;
  }

  if (!aHasGreater && !bHasGreater) return 'equal';
  if (aHasGreater && !bHasGreater) return 'after';
  if (!aHasGreater && bHasGreater) return 'before';
  return 'concurrent';
}

// ─── Conflict resolver ──────────────────────────────────────────────────────

class ConcurrentMoveResolver {
  /** Map of card ID → resolved card state */
  private cardStates = new Map<CardId, CardState>();

  /** Map of column ID → column state */
  private columns = new Map<ColumnId, ColumnState>();

  /** Priority map for deterministic tiebreaking */
  private priorities = new Map<ReplicaId, number>();

  /** Seen operation IDs (for idempotency — applying the same op twice is a no-op) */
  private seenOps = new Set<string>();

  /** Callback fired when a card's resolved state changes */
  private onCardStateChanged: (cardId: CardId, state: CardState) => void;

  constructor(
    priorities: ReplicaPriority[],
    onCardStateChanged: (cardId: CardId, state: CardState) => void,
  ) {
    for (const p of priorities) {
      this.priorities.set(p.replicaId, p.priority);
    }
    this.onCardStateChanged = onCardStateChanged;
  }

  /**
   * Initialize a card's state.
   * Call this when a card is first loaded or created.
   */
  initCard(cardId: CardId, initialColumn: ColumnId, initialPosition: number): void {
    if (this.cardStates.has(cardId)) return; // Already initialized

    this.cardStates.set(cardId, {
      cardId,
      currentColumn: initialColumn,
      position: initialPosition,
      moveHistory: [],
      mergedClock: {},
    });
  }

  /**
   * Apply a move operation to the card state.
   *
   * This is the core CRDT merge function. It must be:
   *   - Commutative: apply(A, B) === apply(B, A)
   *   - Associative: apply(apply(A, B), C) === apply(A, apply(B, C))
   *   - Idempotent: apply(A) === apply(apply(A))
   *
   * These properties ensure that regardless of the order in which
   * operations arrive (due to network latency, WebSocket reordering, etc.),
   * all replicas converge to the same state.
   */
  applyMove(op: MoveOperation): void {
    // --- Idempotency check ---
    if (this.seenOps.has(op.opId)) return;
    this.seenOps.add(op.opId);

    // --- Get or initialize the card state ---
    let cardState = this.cardStates.get(op.cardId);
    if (!cardState) {
      // Card not yet tracked — initialize from the operation's source
      cardState = {
        cardId: op.cardId,
        currentColumn: op.fromColumn,
        position: 0,
        moveHistory: [],
        mergedClock: {},
      };
      this.cardStates.set(op.cardId, cardState);
    }

    // --- Check if this operation is stale ---
    // Compare the operation's vector clock with the card's merged clock.
    // If the op's clock is "before" the merged clock, a newer operation
    // has already been applied — this one is stale.
    const clockRelation = compareClocks(op.vectorClock, cardState.mergedClock);

    if (clockRelation === 'before') {
      // This operation is strictly older than what we've already applied.
      // Drop it — a newer move has already superseded it.
      return;
    }

    if (clockRelation === 'concurrent') {
      // CONFLICT: Two concurrent moves on the same card.
      // Resolve using deterministic tiebreaker.
      const winner = this.resolveConflict(op, cardState);

      if (winner === op) {
        // The incoming operation wins — apply it
        this.executeMove(op, cardState);
      }
      // else: the existing state wins — do nothing
      // (The incoming move is rejected in favor of the higher-priority one)

      return;
    }

    // 'after' or 'equal' — apply the operation normally
    this.executeMove(op, cardState);
  }

  /**
   * Execute a move — update the card's state and the column's card list.
   */
  private executeMove(op: MoveOperation, cardState: CardState): void {
    // Remove card from its old column
    const oldColumn = this.columns.get(cardState.currentColumn);
    if (oldColumn) {
      oldColumn.cardIds = oldColumn.cardIds.filter((id) => id !== op.cardId);
    }

    // Add card to the new column at the specified position
    const newColumn = this.columns.get(op.toColumn);
    if (newColumn) {
      newColumn.cardIds.splice(op.toIndex, 0, op.cardId);
    }

    // Update card state
    cardState.currentColumn = op.toColumn;
    cardState.position = op.toIndex;
    cardState.moveHistory.push(op);
    cardState.mergedClock = mergeClocks(cardState.mergedClock, op.vectorClock);

    // Notify listeners (e.g., React state update)
    this.onCardStateChanged(op.cardId, { ...cardState });
  }

  /**
   * Resolve a concurrent move conflict.
   *
   * Deterministic tiebreaker (in order):
   *   1. Vector clock: if one happens after the other, the later one wins
   *   2. Replica priority: higher priority replica's move wins
   *   3. Timestamp: later timestamp wins
   *   4. Op ID: lexicographically greater op ID wins (final fallback)
   *
   * The key insight: this function must return the same result on ALL replicas
   * when given the same two operations, regardless of which order they're
   * compared in. That's what makes it a valid CRDT merge.
   */
  private resolveConflict(
    incoming: MoveOperation,
    existing: CardState,
  ): MoveOperation {
    const lastExisting = existing.moveHistory[existing.moveHistory.length - 1];
    if (!lastExisting) return incoming; // No existing move — incoming wins

    // Step 1: Already compared clocks — they're concurrent (caller checked)

    // Step 2: Replica priority
    const incomingPriority = this.priorities.get(incoming.replicaId) ?? Infinity;
    const existingPriority = this.priorities.get(lastExisting.replicaId) ?? Infinity;

    if (incomingPriority !== existingPriority) {
      return incomingPriority < existingPriority ? incoming : lastExisting;
    }

    // Step 3: Timestamp
    if (incoming.timestamp !== lastExisting.timestamp) {
      return incoming.timestamp > lastExisting.timestamp ? incoming : lastExisting;
    }

    // Step 4: Op ID (lexicographic — deterministic final tiebreaker)
    return incoming.opId > lastExisting.opId ? incoming : lastExisting;
  }

  /**
   * Generate a move operation from user action.
   * Call this when a user drops a card on a column.
   */
  createMoveOp(
    cardId: CardId,
    fromColumn: ColumnId,
    toColumn: ColumnId,
    toIndex: number,
    replicaId: ReplicaId,
    currentClock: VectorClock,
  ): MoveOperation {
    const newClock = incrementClock(currentClock, replicaId);

    return {
      cardId,
      fromColumn,
      toColumn,
      toIndex,
      vectorClock: newClock,
      replicaId,
      timestamp: Date.now(),
      opId: `${replicaId}:${newClock[replicaId]}:${cardId}:${Date.now()}`,
    };
  }

  /** Register a column */
  registerColumn(id: ColumnId): void {
    if (!this.columns.has(id)) {
      this.columns.set(id, { id, cardIds: [] });
    }
  }

  /** Get the resolved state of a card */
  getCardState(cardId: CardId): CardState | undefined {
    return this.cardStates.get(cardId);
  }

  /** Get the card order in a column */
  getColumnCardIds(columnId: ColumnId): CardId[] {
    return this.columns.get(columnId)?.cardIds ?? [];
  }

  /** Get all seen operation IDs (for debugging) */
  getSeenOps(): Set<string> {
    return new Set(this.seenOps);
  }
}

// ─── Usage example (commented out) ──────────────────────────────────────────

// const resolver = new ConcurrentMoveResolver(
//   [
//     { replicaId: 'user-alice', priority: 0 }, // Admin
//     { replicaId: 'user-bob', priority: 1 },   // Editor
//   ],
//   (cardId, state) => {
//     // Update React state
//     setCardStates((prev) => new Map(prev).set(cardId, state));
//   },
// );
//
// // Initialize cards from server data
// resolver.initCard('task-42', 'todo', 0);
// resolver.registerColumn('todo');
// resolver.registerColumn('done');
// resolver.registerColumn('archived');
//
// // User Alice moves task-42 to "done"
// const aliceClock = {};
// const aliceOp = resolver.createMoveOp(
//   'task-42', 'todo', 'done', 0, 'user-alice', aliceClock,
// );
// resolver.applyMove(aliceOp);
// // Result: task-42 is in "done" at position 0
//
// // Concurrently, User Bob moves task-42 to "archived"
// // (Bob's clock doesn't know about Alice's move yet)
// const bobClock = {};
// const bobOp = resolver.createMoveOp(
//   'task-42', 'todo', 'archived', 0, 'user-bob', bobClock,
// );
// resolver.applyMove(bobOp);
// // Clock comparison: concurrent → conflict!
// // Tiebreaker: Alice has priority 0, Bob has priority 1
// // Alice's move wins → task-42 stays in "done"
//
// // When Bob receives Alice's operation via the server,
// // his resolver also applies it and converges to the same state:
// // task-42 is in "done" — both replicas agree.

export {
  ConcurrentMoveResolver,
  incrementClock,
  mergeClocks,
  compareClocks,
};
export type {
  VectorClock,
  MoveOperation,
  CardState,
  ColumnState,
  ReplicaId,
  ColumnId,
  CardId,
  ReplicaPriority,
};
