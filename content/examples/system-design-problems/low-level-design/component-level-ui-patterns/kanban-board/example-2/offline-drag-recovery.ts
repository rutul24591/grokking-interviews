/**
 * Offline Drag Recovery — WebSocket Disconnect Handling
 *
 * Edge case: User is dragging a card from "Todo" to "Done" when the WebSocket
 * connection drops (network switch, laptop lid closed, server restart).
 *
 * What can go wrong:
 *   1. **Lost move**: The card visually moves on the client, but the server
 *      never receives the move operation. On reconnect, the card snaps back
 *      to its old position — confusing UX.
 *
 *   2. **Duplicate move**: The client sends the move, the server processes it,
 *      but the acknowledgment is lost. On reconnect, the client re-sends,
 *      and the move is applied twice.
 *
 *   3. **Partial state**: The drag is in progress (card is mid-air, not yet
 *      dropped) when disconnect happens. The UI is in an inconsistent state.
 *
 *   4. **Reconciliation conflicts**: While disconnected, other users may have
 *      moved or deleted the same card. When the client reconnects, its queued
 *      move may conflict with the server's current state.
 *
 * Strategy:
 *   - Maintain a local operation queue during disconnect
 *   - Use optimistic UI updates (card moves immediately on drop)
 *   - Tag each operation with a unique ID for deduplication on replay
 *   - On reconnect, reconcile the local queue with server state before
 *     replaying pending operations
 */

// ─── Types ───────────────────────────────────────────────────────────────────

type ConnectionStatus = 'connected' | 'disconnected' | 'reconnecting';

interface QueuedOperation {
  /** Unique operation ID for idempotent replay */
  opId: string;
  /** The operation type */
  type: 'MOVE_CARD' | 'DELETE_CARD' | 'CREATE_CARD';
  /** Serialized operation payload */
  payload: Record<string, unknown>;
  /** Local timestamp when the operation was queued */
  queuedAt: number;
  /** Whether the server has acknowledged this operation */
  acknowledged: boolean;
  /** Number of send attempts (for exponential backoff) */
  attempts: number;
}

interface ReconciliationResult {
  /** Operations that can be safely replayed (no conflict) */
  safeToReplay: QueuedOperation[];
  /** Operations that conflict with server state — need resolution */
  conflicts: { operation: QueuedOperation; conflict: ConflictInfo }[];
  /** Server state snapshot used for reconciliation */
  serverSnapshot: ServerStateSnapshot;
}

interface ConflictInfo {
  /** What changed on the server that conflicts */
  serverChange: string;
  /** Suggested resolution */
  suggestion: 'apply-server-wins' | 'apply-client-wins' | 'manual-resolution';
}

interface ServerStateSnapshot {
  /** Map of card ID → current column and position */
  cardLocations: Map<string, { column: string; position: number }>;
  /** Map of card ID → whether the card exists on the server */
  cardExistence: Map<string, boolean>;
  /** Server timestamp when the snapshot was taken */
  snapshotAt: number;
}

interface OfflineRecoveryConfig {
  /** WebSocket send function */
  wsSend: (message: string) => void;
  /** Called when operations need to be reconciled */
  onConflict: (conflicts: ConflictInfo[]) => void;
  /** Called when all pending ops are acknowledged */
  onSyncComplete: () => void;
  /** Maximum number of send attempts before marking as failed */
  maxRetries: number;
  /** Base delay for exponential backoff in ms */
  baseRetryDelayMs: number;
}

// ─── Core recovery handler ──────────────────────────────────────────────────

class OfflineDragRecovery {
  private config: OfflineRecoveryConfig;

  /** Current connection status */
  private status: ConnectionStatus = 'connected';

  /** Queue of operations that haven't been acknowledged by the server */
  private pendingQueue: QueuedOperation[] = [];

  /** Set of acknowledged operation IDs (for dedup) */
  private acknowledgedOps = new Set<string>();

  /** In-flight operations (sent but not yet acknowledged) */
  private inFlightOps = new Map<string, QueuedOperation>();

  /** Retry timers for pending operations */
  private retryTimers = new Map<string, ReturnType<typeof setTimeout>>();

  /** The operation currently being retried */
  private currentRetryOp: QueuedOperation | null = null;

  constructor(config: OfflineRecoveryConfig) {
    this.config = config;
  }

  // ─── Public API ───────────────────────────────────────────────────────

  /**
   * Called when a drag-drop operation completes locally.
   *
   * If connected: send immediately via WebSocket
   * If disconnected: queue the operation for later replay
   *
   * The UI has already been updated optimistically — the user sees the
   * card in its new position immediately regardless of connection status.
   */
  enqueueOperation(op: Omit<QueuedOperation, 'queuedAt' | 'acknowledged' | 'attempts'>): void {
    const queued: QueuedOperation = {
      ...op,
      queuedAt: Date.now(),
      acknowledged: false,
      attempts: 0,
    };

    if (this.status === 'connected') {
      // Send immediately
      this.sendOperation(queued);
    } else {
      // Queue for later
      this.pendingQueue.push(queued);
      // Persist to localStorage for crash recovery
      this.persistQueue();
    }
  }

  /**
   * Called when the WebSocket connection is established (or re-established).
   *
   * Reconciliation flow:
   *   1. Request the current server state snapshot
   *   2. Compare pending local operations against server state
   *   3. For operations whose effects are already reflected on the server
   *      (e.g., server already has the card in the right column), mark as
   *      acknowledged and skip replay
   *   4. For operations that conflict, flag them for resolution
   *   5. Replay safe operations in order
   */
  async onReconnect(fetchServerState: () => Promise<ServerStateSnapshot>): Promise<void> {
    this.status = 'reconnecting';

    try {
      const serverState = await fetchServerState();
      const reconciliation = this.reconcile(serverState);

      // Mark conflicts for manual resolution if needed
      if (reconciliation.conflicts.length > 0) {
        this.config.onConflict(
          reconciliation.conflicts.map((c) => c.conflict),
        );

        // Apply server-wins conflicts automatically, defer manual ones
        for (const conflict of reconciliation.conflicts) {
          if (conflict.conflict.suggestion === 'apply-server-wins') {
            // Remove the conflicting operation from the queue — server state wins
            this.removeFromQueue(conflict.operation.opId);
          }
          // 'apply-client-wins' → will be replayed below
          // 'manual-resolution' → wait for user input
        }
      }

      // Replay safe operations
      for (const op of reconciliation.safeToReplay) {
        this.sendOperation(op);
      }

      // If no pending operations remain, we're fully synced
      if (this.pendingQueue.length === 0 && this.inFlightOps.size === 0) {
        this.status = 'connected';
        this.config.onSyncComplete();
      }
    } catch (error) {
      console.error('[OfflineDragRecovery] Reconciliation failed:', error);
      // Stay in reconnecting state — retry when the user triggers a sync
    }
  }

  /**
   * Called when the server acknowledges an operation.
   * The server should echo back the opId.
   */
  onAcknowledge(opId: string): void {
    this.acknowledgedOps.add(opId);

    // Remove from in-flight
    const op = this.inFlightOps.get(opId);
    if (op) {
      op.acknowledged = true;
      this.inFlightOps.delete(opId);
    }

    // Remove from pending queue
    this.pendingQueue = this.pendingQueue.filter((o) => o.opId !== opId);

    // Clear any retry timer
    const timer = this.retryTimers.get(opId);
    if (timer) {
      clearTimeout(timer);
      this.retryTimers.delete(opId);
    }

    this.persistQueue();

    // Check if we're fully synced
    if (this.pendingQueue.length === 0 && this.inFlightOps.size === 0) {
      this.config.onSyncComplete();
    }
  }

  /**
   * Called when the WebSocket connection drops.
   */
  onDisconnect(): void {
    this.status = 'disconnected';

    // Cancel all in-flight operations — they'll be replayed on reconnect
    for (const [opId, op] of this.inFlightOps) {
      // Move back to pending queue for replay
      op.acknowledged = false;
      op.attempts = 0; // Reset attempts so they get fresh retries on reconnect
      if (!this.pendingQueue.some((o) => o.opId === opId)) {
        this.pendingQueue.push(op);
      }
    }
    this.inFlightOps.clear();

    // Clear all retry timers
    for (const [opId, timer] of this.retryTimers) {
      clearTimeout(timer);
    }
    this.retryTimers.clear();

    this.persistQueue();
  }

  // ─── Reconciliation ──────────────────────────────────────────────────

  /**
   * Compare pending local operations against the server's current state.
   *
   * For each pending operation, check if the server already reflects
   * the intended state. If so, the operation is a duplicate and can be
   * safely discarded.
   *
   * Example:
   *   Pending op: Move card "T-42" from "Todo" to "Done"
   *   Server state: Card "T-42" is already in "Done" at position 3
   *   → This op is already reflected → safe to discard (not replay)
   *
   * Example (conflict):
   *   Pending op: Move card "T-42" to "Done"
   *   Server state: Card "T-42" was deleted
   *   → Conflict: can't move a deleted card → manual resolution needed
   */
  private reconcile(serverState: ServerStateSnapshot): ReconciliationResult {
    const safeToReplay: QueuedOperation[] = [];
    const conflicts: ReconciliationResult['conflicts'] = [];

    for (const op of this.pendingQueue) {
      if (op.type === 'MOVE_CARD') {
        const payload = op.payload as { cardId: string; toColumn: string; toIndex: number };
        const serverLocation = serverState.cardLocations.get(payload.cardId);
        const cardExists = serverState.cardExistence.get(payload.cardId);

        if (cardExists === false) {
          // Card was deleted on the server
          conflicts.push({
            operation: op,
            conflict: {
              serverChange: `Card "${payload.cardId}" was deleted on the server`,
              suggestion: 'apply-server-wins',
            },
          });
        } else if (
          serverLocation &&
          serverLocation.column === payload.toColumn &&
          serverLocation.position === payload.toIndex
        ) {
          // Server already reflects this move → safe to discard
          // (Don't add to safeToReplay — just skip it)
          this.acknowledgedOps.add(op.opId);
          op.acknowledged = true;
        } else if (serverLocation && serverLocation.column !== payload.toColumn) {
          // Card exists but is in a different column than our target
          // Another user moved it → conflict
          conflicts.push({
            operation: op,
            conflict: {
              serverChange: `Card "${payload.cardId}" is in "${serverLocation.column}" on server, ` +
                `you moved it to "${payload.toColumn}"`,
              suggestion: 'apply-client-wins',
            },
          });
          safeToReplay.push(op);
        } else {
          // Card exists, server doesn't have a location yet (new card?) → safe to replay
          safeToReplay.push(op);
        }
      } else {
        // Non-move operations — replay them all
        safeToReplay.push(op);
      }
    }

    // Remove acknowledged ops from the pending queue
    this.pendingQueue = this.pendingQueue.filter((o) => !o.acknowledged);

    return {
      safeToReplay,
      conflicts,
      serverSnapshot: serverState,
    };
  }

  // ─── Send with retry ────────────────────────────────────────────────

  private sendOperation(op: QueuedOperation): void {
    if (this.status !== 'connected') {
      // Can't send — queue it
      if (!this.pendingQueue.some((o) => o.opId === op.opId)) {
        this.pendingQueue.push(op);
      }
      return;
    }

    op.attempts++;
    this.inFlightOps.set(op.opId, op);

    try {
      this.config.wsSend(JSON.stringify({
        type: op.type,
        opId: op.opId,
        payload: op.payload,
      }));

      // Schedule retry if no acknowledgment within timeout
      const retryDelay = this.config.baseRetryDelayMs * Math.pow(2, op.attempts - 1);
      const timer = setTimeout(() => {
        if (this.inFlightOps.has(op.opId) && op.attempts < this.config.maxRetries) {
          this.sendOperation(op); // Retry
        } else if (op.attempts >= this.config.maxRetries) {
          // Max retries exceeded — move back to pending for reconnect
          op.acknowledged = false;
          this.inFlightOps.delete(op.opId);
          this.pendingQueue.push(op);
          this.persistQueue();
        }
      }, retryDelay);

      this.retryTimers.set(op.opId, timer);
    } catch {
      // Send failed — move back to pending
      this.inFlightOps.delete(op.opId);
      this.pendingQueue.push(op);
      this.persistQueue();
    }
  }

  private removeFromQueue(opId: string): void {
    this.pendingQueue = this.pendingQueue.filter((o) => o.opId !== opId);
    this.acknowledgedOps.add(opId);
    this.persistQueue();
  }

  // ─── Persistence ────────────────────────────────────────────────────

  /**
   * Persist the pending queue to localStorage for crash recovery.
   * If the browser tab is closed while disconnected, the queue survives.
   */
  private persistQueue(): void {
    try {
      localStorage.setItem(
        'kanban-pending-ops',
        JSON.stringify(this.pendingQueue),
      );
    } catch {
      // localStorage might be full or disabled — degrade gracefully
      console.warn('[OfflineDragRecovery] Failed to persist queue');
    }
  }

  /**
   * Restore the pending queue from localStorage on page load.
   */
  restoreQueue(): void {
    try {
      const stored = localStorage.getItem('kanban-pending-ops');
      if (stored) {
        this.pendingQueue = JSON.parse(stored);
        localStorage.removeItem('kanban-pending-ops');
      }
    } catch {
      console.warn('[OfflineDragRecovery] Failed to restore queue');
    }
  }

  /** Current status */
  get connectionStatus(): ConnectionStatus {
    return this.status;
  }

  /** Number of pending operations */
  get pendingCount(): number {
    return this.pendingQueue.length;
  }
}

// ─── Usage example (commented out) ──────────────────────────────────────────

// const recovery = new OfflineDragRecovery({
//   wsSend: (msg) => websocket.send(msg),
//   onConflict: (conflicts) => {
//     // Show a toast: "Some changes conflict with the server. Review?"
//     showConflictDialog(conflicts);
//   },
//   onSyncComplete: () => {
//     // Hide the "offline" indicator
//     setConnectionStatus('online');
//   },
//   maxRetries: 3,
//   baseRetryDelayMs: 1000,
// });
//
// // On page load, restore any persisted operations
// recovery.restoreQueue();
//
// // When user drops a card:
// function onCardDrop(cardId: string, fromColumn: string, toColumn: string, toIndex: number) {
//   // Optimistic UI update — move the card immediately
//   updateLocalBoard(cardId, toColumn, toIndex);
//
//   // Enqueue the operation
//   recovery.enqueueOperation({
//     opId: `move-${cardId}-${Date.now()}`,
//     type: 'MOVE_CARD',
//     payload: { cardId, fromColumn, toColumn, toIndex },
//   });
// }
//
// // WebSocket events:
// websocket.onopen = () => {
//   recovery.onReconnect(async () => {
//     const res = await fetch('/api/board/snapshot');
//     return res.json();
//   });
// };
//
// websocket.onclose = () => {
//   recovery.onDisconnect();
//   setConnectionStatus('offline');
// };
//
// websocket.onmessage = (event) => {
//   const msg = JSON.parse(event.data);
//   if (msg.type === 'ack') {
//     recovery.onAcknowledge(msg.opId);
//   }
// };

export { OfflineDragRecovery };
export type {
  ConnectionStatus,
  QueuedOperation,
  ReconciliationResult,
  ConflictInfo,
  ServerStateSnapshot,
  OfflineRecoveryConfig,
};
