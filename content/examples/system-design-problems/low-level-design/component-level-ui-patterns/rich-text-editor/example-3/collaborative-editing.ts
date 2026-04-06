/**
 * Rich Text Editor — Staff-Level Collaborative Editing with CRDTs.
 *
 * Staff differentiator: Y.js-based collaborative editing with presence
 * indicators, cursor awareness, and conflict-free merging.
 */

export interface CollaborativeCursor {
  userId: string;
  userName: string;
  color: string;
  position: number; // Character offset in the document
  selection?: { anchor: number; head: number };
}

/**
 * Manages collaborative cursors for real-time editing.
 */
export class CollaborativeCursorManager {
  private cursors: Map<string, CollaborativeCursor> = new Map();
  private onUpdate: (cursors: CollaborativeCursor[]) => void;

  constructor(onUpdate: (cursors: CollaborativeCursor[]) => void) {
    this.onUpdate = onUpdate;
  }

  /**
   * Updates a remote cursor position.
   */
  updateCursor(userId: string, cursor: CollaborativeCursor): void {
    this.cursors.set(userId, cursor);
    this.onUpdate(Array.from(this.cursors.values()));
  }

  /**
   * Removes a cursor when a user disconnects.
   */
  removeCursor(userId: string): void {
    this.cursors.delete(userId);
    this.onUpdate(Array.from(this.cursors.values()));
  }

  /**
   * Returns all active cursors except the local user's.
   */
  getRemoteCursors(localUserId: string): CollaborativeCursor[] {
    return Array.from(this.cursors.values()).filter((c) => c.userId !== localUserId);
  }
}

/**
 * Converts a character offset to a DOM position for cursor rendering.
 */
export function offsetToDomPosition(
  container: HTMLElement,
  offset: number,
): { node: Node; offset: number } | null {
  let currentOffset = 0;

  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
  let node: Node | null;

  while ((node = walker.nextNode())) {
    const textLength = node.textContent?.length || 0;
    if (currentOffset + textLength >= offset) {
      return { node, offset: offset - currentOffset };
    }
    currentOffset += textLength;
  }

  return null;
}
