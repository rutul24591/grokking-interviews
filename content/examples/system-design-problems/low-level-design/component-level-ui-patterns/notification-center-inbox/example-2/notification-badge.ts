/**
 * Notification Badge with Document Title Prefix — Updates tab title with unread count.
 *
 * Interview edge case: User has 5 unread notifications but is looking at another tab.
 * The browser tab should show "(5) Page Title" so the user knows there are pending
 * notifications. When all are read, the prefix is removed.
 */

const MAX_BADGE_COUNT = 99;

/**
 * Manages notification badge display and document title prefix.
 */
export class NotificationBadgeManager {
  private unreadCount: number = 0;
  private originalTitle: string = '';
  private initialized: boolean = false;

  /**
   * Updates the unread count and updates the document title prefix.
   */
  updateCount(count: number): void {
    this.unreadCount = Math.max(0, count);
    this.updateTitle();
  }

  /**
   * Increments the unread count by 1.
   */
  increment(): void {
    this.unreadCount++;
    this.updateTitle();
  }

  /**
   * Decrements the unread count by 1 (min 0).
   */
  decrement(): void {
    this.unreadCount = Math.max(0, this.unreadCount - 1);
    this.updateTitle();
  }

  /**
   * Resets the unread count to 0 and removes the title prefix.
   */
  reset(): void {
    this.unreadCount = 0;
    this.updateTitle();
  }

  /**
   * Returns the current unread count.
   */
  getCount(): number {
    return this.unreadCount;
  }

  /**
   * Returns the badge text (capped at 99+).
   */
  getBadgeText(): string {
    if (this.unreadCount === 0) return '';
    if (this.unreadCount > MAX_BADGE_COUNT) return `${MAX_BADGE_COUNT}+`;
    return String(this.unreadCount);
  }

  /**
   * Updates the document title with the unread count prefix.
   */
  private updateTitle(): void {
    if (typeof document === 'undefined') return;

    if (!this.initialized) {
      this.originalTitle = document.title;
      this.initialized = true;
    }

    const badgeText = this.getBadgeText();
    document.title = badgeText ? `(${badgeText}) ${this.originalTitle}` : this.originalTitle;
  }
}
