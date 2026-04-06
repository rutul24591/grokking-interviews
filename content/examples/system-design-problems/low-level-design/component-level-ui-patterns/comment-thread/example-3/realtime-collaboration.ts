/**
 * Comment Thread — Staff-Level Real-Time Collaboration.
 *
 * Staff differentiator: CRDT-based comment ordering for concurrent edits,
 * presence indicators for users viewing the same thread, and optimistic
 * comment posting with server reconciliation.
 */

export interface CommentPresence {
  userId: string;
  userName: string;
  cursorPosition: { commentId: string; charOffset: number } | null;
  lastActive: number;
}

/**
 * Manages real-time presence for users viewing the same comment thread.
 */
export class CommentPresenceManager {
  private presences: Map<string, CommentPresence> = new Map();
  private heartbeatInterval: ReturnType<typeof setInterval> | null = null;
  private readonly TIMEOUT_MS = 10000; // 10s without heartbeat = offline

  /**
   * Updates presence for a user.
   */
  updatePresence(userId: string, userName: string, cursorPosition: CommentPresence['cursorPosition']): void {
    this.presences.set(userId, { userId, userName, cursorPosition, lastActive: Date.now() });
  }

  /**
   * Removes a user's presence.
   */
  removePresence(userId: string): void {
    this.presences.delete(userId);
  }

  /**
   * Returns all active presences (users who sent a heartbeat within the timeout).
   */
  getActivePresences(): CommentPresence[] {
    const now = Date.now();
    return Array.from(this.presences.values()).filter((p) => now - p.lastActive < this.TIMEOUT_MS);
  }

  /**
   * Starts the heartbeat interval for presence broadcasting.
   */
  startHeartbeat(broadcastFn: (presence: CommentPresence) => void, myUserId: string, myUserName: string): void {
    this.heartbeatInterval = setInterval(() => {
      const presence: CommentPresence = {
        userId: myUserId,
        userName: myUserName,
        cursorPosition: null,
        lastActive: Date.now(),
      };
      broadcastFn(presence);
    }, 3000);
  }

  /**
   * Stops the heartbeat.
   */
  stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }
}
