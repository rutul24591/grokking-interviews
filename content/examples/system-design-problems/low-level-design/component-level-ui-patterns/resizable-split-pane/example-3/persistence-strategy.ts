/**
 * Resizable Split Pane — Staff-Level Multi-User Layout Sync.
 *
 * Staff differentiator: Layout synchronization across multiple users
 * viewing the same content, conflict resolution when users resize
 * simultaneously, and layout versioning for undo.
 */

export interface LayoutState {
  dividerPosition: number;
  containerSize: number;
  version: number;
  authorId: string;
  timestamp: number;
}

/**
 * Manages layout state with multi-user sync and conflict resolution.
 * Uses last-write-wins with version tracking for consistency.
 */
export class MultiUserLayoutManager {
  private currentLayout: LayoutState | null = null;
  private layoutHistory: LayoutState[] = [];
  private maxHistory: number = 50;

  /**
   * Applies a local layout change and broadcasts to other users.
   */
  applyLocalChange(
    dividerPosition: number,
    containerSize: number,
    authorId: string,
    broadcastFn: (layout: LayoutState) => void,
  ): LayoutState {
    const layout: LayoutState = {
      dividerPosition,
      containerSize,
      version: (this.currentLayout?.version || 0) + 1,
      authorId,
      timestamp: Date.now(),
    };

    this.currentLayout = layout;
    this.layoutHistory.push(layout);

    // Trim history
    if (this.layoutHistory.length > this.maxHistory) {
      this.layoutHistory = this.layoutHistory.slice(-this.maxHistory);
    }

    broadcastFn(layout);
    return layout;
  }

  /**
   * Receives a remote layout change from another user.
   * Applies it only if it's newer than the current version.
   */
  receiveRemoteChange(remote: LayoutState): 'applied' | 'ignored' | 'conflict' {
    if (!this.currentLayout) {
      this.currentLayout = remote;
      return 'applied';
    }

    if (remote.version <= this.currentLayout.version) {
      return 'ignored'; // Stale update
    }

    if (remote.authorId === this.currentLayout.authorId) {
      return 'conflict'; // Same user, unexpected version gap
    }

    // Last-write-wins: accept the newer version
    this.currentLayout = remote;
    this.layoutHistory.push(remote);
    return 'applied';
  }

  /**
   * Undoes the last layout change.
   */
  undo(): LayoutState | null {
    if (this.layoutHistory.length < 2) return null;

    this.layoutHistory.pop(); // Remove current
    const previous = this.layoutHistory[this.layoutHistory.length - 1];
    this.currentLayout = previous;
    return previous;
  }

  getCurrentLayout(): LayoutState | null {
    return this.currentLayout;
  }
}
