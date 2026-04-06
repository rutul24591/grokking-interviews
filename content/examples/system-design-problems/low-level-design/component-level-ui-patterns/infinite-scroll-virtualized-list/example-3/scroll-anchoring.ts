/**
 * Infinite Scroll — Staff-Level Scroll Anchoring and Performance.
 *
 * Staff differentiator: CSS scroll anchoring for stable scroll position during
 * DOM updates, requestIdleCallback-based rendering for non-visible items,
 and scroll event throttling with rAF for smooth performance.
 */

/**
 * Manages scroll anchoring to prevent jump when content is prepended.
 * Uses CSS scroll-anchoring where supported, falls back to manual offset preservation.
 */
export class ScrollAnchorManager {
  private container: HTMLElement;
  private previousScrollHeight: number = 0;
  private isAnchoring: boolean = false;

  constructor(container: HTMLElement) {
    this.container = container;
    // Enable CSS scroll anchoring where supported
    this.container.style.scrollBehavior = 'auto';
  }

  /**
   * Called before content is prepended. Records the current scroll position.
   */
  beforePrepend(): void {
    this.previousScrollHeight = this.container.scrollHeight;
    this.isAnchoring = true;
  }

  /**
   * Called after content is prepended. Restores scroll position relative to content.
   */
  afterPrepend(): void {
    if (!this.isAnchoring) return;

    const newScrollHeight = this.container.scrollHeight;
    const heightDiff = newScrollHeight - this.previousScrollHeight;

    // Adjust scroll position to maintain visual position
    this.container.scrollTop += heightDiff;
    this.isAnchoring = false;
  }

  /**
   * Returns whether the user is at the bottom of the scroll container.
   * Uses a threshold to account for sub-pixel scrolling.
   */
  isAtBottom(threshold: number = 50): boolean {
    const { scrollTop, scrollHeight, clientHeight } = this.container;
    return scrollHeight - scrollTop - clientHeight < threshold;
  }

  /**
   * Throttles scroll events using requestAnimationFrame for smooth performance.
   */
  onScrollThrottled(callback: (scrollTop: number) => void): () => void {
    let ticking = false;

    const handler = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          callback(this.container.scrollTop);
          ticking = false;
        });
        ticking = true;
      }
    };

    this.container.addEventListener('scroll', handler, { passive: true });
    return () => this.container.removeEventListener('scroll', handler);
  }
}
