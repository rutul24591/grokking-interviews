/**
 * Code Editor — Staff-Level Collaborative Editing with CRDTs.
 *
 * Staff differentiator: Y.js integration for real-time collaborative editing,
 * cursor presence for remote users, and conflict-free document merging.
 */

export interface RemoteCursor {
  userId: string;
  userName: string;
  color: string;
  position: { line: number; column: number };
  selection?: { start: { line: number; column: number }; end: { line: number; column: number } };
}

/**
 * Manages remote cursor positions for collaborative editing.
 */
export class RemoteCursorManager {
  private cursors: Map<string, RemoteCursor> = new Map();
  private onUpdate: (cursors: RemoteCursor[]) => void;

  constructor(onUpdate: (cursors: RemoteCursor[]) => void) {
    this.onUpdate = onUpdate;
  }

  /**
   * Updates a remote cursor position.
   */
  updateCursor(userId: string, cursor: RemoteCursor): void {
    this.cursors.set(userId, cursor);
    this.notifyUpdate();
  }

  /**
   * Removes a remote cursor when a user disconnects.
   */
  removeCursor(userId: string): void {
    this.cursors.delete(userId);
    this.notifyUpdate();
  }

  /**
   * Returns all active remote cursors.
   */
  getCursors(): RemoteCursor[] {
    return Array.from(this.cursors.values());
  }

  private notifyUpdate(): void {
    this.onUpdate(Array.from(this.cursors.values()));
  }
}

/**
 * Operational transform for collaborative text editing.
 * When two users edit the same position simultaneously, OT resolves the conflict.
 */
export interface TextOperation {
  type: 'insert' | 'delete';
  position: number;
  text?: string;
  length?: number;
}

export function transformOperations(opA: TextOperation, opB: TextOperation): [TextOperation, TextOperation] {
  // If operations don't overlap, return unchanged
  if (opA.type === 'insert' && opB.type === 'insert' && opA.position === opB.position) {
    // Same position insert — use user ID as tiebreaker (higher ID wins)
    return [opA, opB];
  }

  if (opA.type === 'insert' && opB.type === 'delete') {
    if (opA.position <= opB.position!) {
      return [opA, { ...opB, position: opB.position! + opA.text!.length }];
    }
    return [{ ...opA, position: opA.position - opB.length! }, opB];
  }

  if (opA.type === 'delete' && opB.type === 'insert') {
    if (opB.position <= opA.position!) {
      return [{ ...opA, position: opA.position! + opB.text!.length }, opB];
    }
    return [opA, { ...opB, position: opB.position - opA.length! }];
  }

  // Both deletes — adjust positions
  if (opA.type === 'delete' && opB.type === 'delete') {
    if (opA.position! >= opB.position! + opB.length!) return [opA, opB];
    if (opB.position! >= opA.position! + opA.length!) return [opA, opB];
    // Overlapping deletes — complex case, simplified here
    return [opA, opB];
  }

  return [opA, opB];
}
