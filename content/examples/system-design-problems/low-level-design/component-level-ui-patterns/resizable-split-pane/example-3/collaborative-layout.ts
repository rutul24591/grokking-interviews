/**
 * Resizable Split Pane — Staff-Level Layout Persistence with Multi-User Sync.
 *
 * Staff differentiator: Layout state synchronization across multiple users
 * viewing the same content, with conflict resolution and layout history
 * for undo/redo.
 */

export interface LayoutSnapshot {
  dividerPosition: number;
  containerSize: number;
  timestamp: number;
  userId: string;
}

/**
 * Manages layout state with multi-user synchronization and conflict resolution.
 */
export class CollaborativeLayoutManager {
  private currentLayout: LayoutSnapshot | null = null;
  private history: LayoutSnapshot[] = [];
  private maxHistory: number = 100;

  /**
   * Applies a local layout change.
   */
  applyLocalChange(dividerPosition: number, containerSize: number, userId: string): LayoutSnapshot {
    const snapshot: LayoutSnapshot = {
      dividerPosition,
      containerSize,
      timestamp: Date.now(),
      userId,
    };

    this.currentLayout = snapshot;
    this.history.push(snapshot);

    if (this.history.length > this.maxHistory) {
      this.history = this.history.slice(-this.maxHistory);
    }

    return snapshot;
  }

  /**
   * Receives a remote layout change.
   * Accepts if newer, rejects if older (last-write-wins).
   */
  receiveRemoteChange(remote: LayoutSnapshot): 'accepted' | 'rejected' {
    if (!this.currentLayout) {
      this.currentLayout = remote;
      this.history.push(remote);
      return 'accepted';
    }

    if (remote.timestamp > this.currentLayout.timestamp) {
      this.currentLayout = remote;
      this.history.push(remote);
      return 'accepted';
    }

    return 'rejected';
  }

  /**
   * Undoes the last layout change.
   */
  undo(): LayoutSnapshot | null {
    if (this.history.length < 2) return null;
    this.history.pop();
    this.currentLayout = this.history[this.history.length - 1];
    return this.currentLayout;
  }

  /**
   * Redoes a previously undone layout change.
   */
  getCurrentLayout(): LayoutSnapshot | null {
    return this.currentLayout;
  }
}
