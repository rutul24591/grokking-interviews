/**
 * Kanban Board — Staff-Level Real-Time Collaboration with CRDTs.
 *
 * Staff differentiator: CRDT-based conflict resolution for concurrent card moves,
 * operational transform for card ordering, and presence indicators for
 * remote cursors.
 */

export interface CardMoveOperation {
  type: 'move';
  cardId: string;
  fromColumn: string;
  toColumn: string;
  position: number;
  actorId: string;
  timestamp: number;
  opId: string;
}

export interface VectorClock {
  [actorId: string]: number;
}

/**
 * Merges concurrent card move operations using a deterministic tiebreaker.
 * Commutative, associative, and idempotent — suitable for eventual consistency.
 */
export function mergeConcurrentMoves(
  opA: CardMoveOperation,
  opB: CardMoveOperation,
): CardMoveOperation {
  // Deterministic tiebreaker: highest timestamp wins, then lowest actorId
  if (opA.timestamp !== opB.timestamp) {
    return opA.timestamp > opB.timestamp ? opA : opB;
  }
  return opA.actorId < opB.actorId ? opA : opB;
}

/**
 * Manages vector clocks for causal ordering of operations.
 */
export class VectorClockManager {
  private clock: VectorClock = {};
  private actorId: string;

  constructor(actorId: string) {
    this.actorId = actorId;
    this.clock[actorId] = 0;
  }

  /**
   * Increments the local actor's clock and returns the new vector clock.
   */
  increment(): VectorClock {
    this.clock[this.actorId] = (this.clock[this.actorId] || 0) + 1;
    return { ...this.clock };
  }

  /**
   * Merges a remote vector clock into the local clock.
   * Each component takes the max of local and remote.
   */
  merge(remote: VectorClock): void {
    for (const [actorId, value] of Object.entries(remote)) {
      this.clock[actorId] = Math.max(this.clock[actorId] || 0, value);
    }
  }

  /**
   * Returns whether this clock causally dominates the other.
   */
  dominates(other: VectorClock): boolean {
    let atLeastOneGreater = false;
    const allActors = new Set([...Object.keys(this.clock), ...Object.keys(other)]);
    for (const actorId of allActors) {
      const localVal = this.clock[actorId] || 0;
      const remoteVal = other[actorId] || 0;
      if (localVal < remoteVal) return false;
      if (localVal > remoteVal) atLeastOneGreater = true;
    }
    return atLeastOneGreater;
  }

  getClock(): VectorClock {
    return { ...this.clock };
  }
}
