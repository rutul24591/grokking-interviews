/**
 * Multi-Select Tag Input — Staff-Level Accessibility Deep-Dive.
 *
 * Staff differentiator: Full ARIA combobox pattern with aria-activedescendant,
 * live region announcements for tag add/remove, keyboard deletion with
 * confirmation, and screen reader-optimized tag list.
 */

/**
 * Manages ARIA live region announcements for tag operations.
 */
export class TagAnnouncementManager {
  private liveRegion: HTMLElement | null = null;

  constructor() {
    if (typeof document !== 'undefined') {
      this.liveRegion = document.createElement('div');
      this.liveRegion.setAttribute('aria-live', 'polite');
      this.liveRegion.setAttribute('aria-atomic', 'true');
      this.liveRegion.className = 'sr-only';
      document.body.appendChild(this.liveRegion);
    }
  }

  /**
   * Announces a tag was added.
   */
  announceTagAdded(tagLabel: string, totalCount: number): void {
    if (!this.liveRegion) return;
    this.liveRegion.textContent = `${tagLabel} added. ${totalCount} tags selected.`;
  }

  /**
   * Announces a tag was removed.
   */
  announceTagRemoved(tagLabel: string, totalCount: number): void {
    if (!this.liveRegion) return;
    this.liveRegion.textContent = `${tagLabel} removed. ${totalCount} tags remaining.`;
  }

  /**
   * Announces the current suggestion count.
   */
  announceSuggestions(count: number, query: string): void {
    if (!this.liveRegion) return;
    if (count === 0) {
      this.liveRegion.textContent = `No suggestions found for "${query}". Press Enter to create a new tag.`;
    } else {
      this.liveRegion.textContent = `${count} suggestions available. Use arrow keys to navigate.`;
    }
  }

  /**
   * Announces the currently focused suggestion.
   */
  announceFocusedSuggestion(label: string, index: number, total: number): void {
    if (!this.liveRegion) return;
    this.liveRegion.textContent = `${label}, suggestion ${index + 1} of ${total}. Press Enter to select.`;
  }

  /**
   * Cleans up the live region.
   */
  destroy(): void {
    this.liveRegion?.remove();
    this.liveRegion = null;
  }
}
