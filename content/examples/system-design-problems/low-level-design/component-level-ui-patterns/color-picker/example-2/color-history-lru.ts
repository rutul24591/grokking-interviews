/**
 * Color History with LRU Eviction — Tracks recently used colors.
 *
 * Interview edge case: User selects 20 different colors. The history panel should
 * show only the last 10, with the most recently used at the front. When a color
 * is re-selected, it should move to the front (MRU behavior).
 */

const MAX_HISTORY = 10;

/**
 * Manages a color history with LRU eviction and MRU reordering.
 */
export class ColorHistory {
  private colors: string[] = [];

  /**
   * Adds a color to history. If already present, moves it to front.
   */
  add(hexColor: string): void {
    const normalized = hexColor.toLowerCase();

    // Remove if already present (MRU reordering)
    const existingIndex = this.colors.indexOf(normalized);
    if (existingIndex !== -1) {
      this.colors.splice(existingIndex, 1);
    }

    // Add to front
    this.colors.unshift(normalized);

    // Evict oldest if over capacity
    if (this.colors.length > MAX_HISTORY) {
      this.colors.pop();
    }
  }

  /**
   * Returns the color history (most recent first).
   */
  getColors(): string[] {
    return [...this.colors];
  }

  /**
   * Checks if a color is in history.
   */
  has(hexColor: string): boolean {
    return this.colors.includes(hexColor.toLowerCase());
  }

  /**
   * Clears all history.
   */
  clear(): void {
    this.colors = [];
  }
}
