/**
 * Notification Center — Staff-Level Notification Prioritization Engine.
 *
 * Staff differentiator: ML-based notification scoring (importance × urgency),
 * digest batching for low-priority notifications, and user preference learning
 * from notification interaction patterns.
 */

export interface NotificationWithScore {
  id: string;
  type: string;
  title: string;
  importance: number; // 0-1, how important is this notification
  urgency: number; // 0-1, how time-sensitive is this notification
  score: number; // Combined priority score
  deliveredAt: number;
  isRead: boolean;
}

/**
 * Scores and prioritizes notifications based on importance, urgency, and
 * user interaction patterns.
 */
export class NotificationPrioritizer {
  private readonly importanceWeight: number = 0.4;
  private readonly urgencyWeight: number = 0.6;
  private userPreferences: Map<string, number> = new Map(); // type → interaction rate

  /**
   * Calculates the priority score for a notification.
   * Score = importance × weight + urgency × weight, adjusted by user preferences.
   */
  scoreNotification(notification: Omit<NotificationWithScore, 'score'>): number {
    const baseScore =
      notification.importance * this.importanceWeight +
      notification.urgency * this.urgencyWeight;

    // Adjust based on user's historical interaction with this type
    const interactionRate = this.userPreferences.get(notification.type) ?? 0.5;
    const adjustedScore = baseScore * (0.5 + interactionRate); // 0.5x to 1.5x multiplier

    return Math.min(1, Math.max(0, adjustedScore));
  }

  /**
   * Updates user preferences based on interaction (click, dismiss, etc.).
   */
  recordInteraction(notificationType: string, action: 'clicked' | 'dismissed' | 'marked_read'): void {
    const current = this.userPreferences.get(notificationType) ?? 0.5;

    switch (action) {
      case 'clicked':
        this.userPreferences.set(notificationType, Math.min(1, current + 0.1));
        break;
      case 'dismissed':
        this.userPreferences.set(notificationType, Math.max(0, current - 0.05));
        break;
      case 'marked_read':
        // Neutral — doesn't change preference
        break;
    }
  }

  /**
   * Sorts notifications by priority score.
   */
  sortNotifications(notifications: NotificationWithScore[]): NotificationWithScore[] {
    return [...notifications].sort((a, b) => b.score - a.score);
  }

  /**
   * Groups notifications into immediate and digest categories.
   * High-score notifications are delivered immediately, low-score are batched.
   */
  groupForDelivery(notifications: NotificationWithScore[], digestThreshold: number = 0.3): {
    immediate: NotificationWithScore[];
    digest: NotificationWithScore[];
  } {
    const immediate: NotificationWithScore[] = [];
    const digest: NotificationWithScore[] = [];

    for (const notification of notifications) {
      if (notification.score >= digestThreshold) {
        immediate.push(notification);
      } else {
        digest.push(notification);
      }
    }

    return { immediate, digest };
  }
}
