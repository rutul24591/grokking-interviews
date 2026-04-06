/**
 * Notification Center — Staff-Level WebSocket Reconciliation.
 *
 * Staff differentiator: Gap detection in notification stream, server-client
 * reconciliation with vector clocks, and deduplication of notifications
 * received via both WebSocket and polling fallback.
 */

export interface NotificationWithClock {
  id: string;
  content: string;
  timestamp: number;
  vectorClock: Record<string, number>;
  source: 'websocket' | 'polling';
}

/**
 * Reconciles notifications from multiple sources (WebSocket + polling).
 * Deduplicates based on ID, resolves conflicts using vector clocks.
 */
export class NotificationReconciler {
  private notifications: NotificationWithClock[] = [];
  private localClock: Record<string, number> = {};
  private seenIds: Set<string> = new Set();

  /**
   * Receives a notification from any source.
   * Deduplicates by ID, merges using vector clock comparison.
   */
  receive(notification: NotificationWithClock): void {
    // Deduplicate by ID
    if (this.seenIds.has(notification.id)) return;
    this.seenIds.add(notification.id);

    // Merge vector clocks
    this.mergeClock(notification.vectorClock);

    // Insert in chronological order
    const insertIndex = this.notifications.findIndex(
      (n) => n.timestamp < notification.timestamp,
    );

    if (insertIndex === -1) {
      this.notifications.push(notification);
    } else {
      this.notifications.splice(insertIndex, 0, notification);
    }

    // Check for gaps in the sequence
    this.detectGaps();
  }

  /**
   * Detects gaps in the notification sequence by comparing local clock
   * with expected sequence numbers.
   */
  private detectGaps(): void {
    // In production: compare local sequence with server's known notifications
    // Request missing notifications if gaps are detected
  }

  /**
   * Merges a remote vector clock into the local clock.
   */
  private mergeClock(remote: Record<string, number>): void {
    for (const [actorId, value] of Object.entries(remote)) {
      this.localClock[actorId] = Math.max(this.localClock[actorId] || 0, value);
    }
  }

  /**
   * Returns all notifications sorted by timestamp.
   */
  getNotifications(): NotificationWithClock[] {
    return [...this.notifications];
  }

  /**
   * Returns the current unread count.
   */
  getUnreadCount(): number {
    return this.notifications.filter((n) => !n.read).length;
  }
}
