/**
 * Search Autocomplete — Staff-Level Accessibility Deep-Dive.
 *
 * Staff differentiator: Full ARIA combobox pattern with aria-activedescendant,
 * live region announcements for result count changes, and comprehensive
 * keyboard navigation including IME composition support.
 */

/**
 * Manages ARIA live region announcements for search results.
 * Prevents announcement flooding by throttling and batching.
 */
export class SearchAnnouncementManager {
  private liveRegion: HTMLElement | null = null;
  private lastAnnouncement: string = '';
  private throttleTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(containerId: string = 'search-announcements') {
    if (typeof document !== 'undefined') {
      this.liveRegion = document.getElementById(containerId);
      if (!this.liveRegion) {
        this.liveRegion = document.createElement('div');
        this.liveRegion.id = containerId;
        this.liveRegion.setAttribute('aria-live', 'polite');
        this.liveRegion.setAttribute('aria-atomic', 'true');
        this.liveRegion.className = 'sr-only';
        document.body.appendChild(this.liveRegion);
      }
    }
  }

  /**
   * Announces search results to screen readers with throttling.
   */
  announceResults(query: string, count: number): void {
    if (this.throttleTimer) clearTimeout(this.throttleTimer);

    const message = count === 0
      ? `No results found for "${query}"`
      : count === 1
        ? `1 result found for "${query}"`
        : `${count} results found for "${query}"`;

    // Don't repeat the same announcement
    if (message === this.lastAnnouncement) return;

    this.throttleTimer = setTimeout(() => {
      if (this.liveRegion) {
        this.liveRegion.textContent = message;
        this.lastAnnouncement = message;
      }
    }, 300);
  }

  /**
   * Announces the currently highlighted suggestion.
   */
  announceHighlight(label: string, index: number, total: number): void {
    if (this.liveRegion) {
      this.liveRegion.textContent = `${label}, suggestion ${index + 1} of ${total}`;
    }
  }

  /**
   * Cleans up the live region on unmount.
   */
  destroy(): void {
    if (this.throttleTimer) clearTimeout(this.throttleTimer);
    this.liveRegion?.remove();
    this.liveRegion = null;
  }
}
