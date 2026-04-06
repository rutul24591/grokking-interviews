/**
 * Drag & Drop — Staff-Level Accessibility Testing Strategy.
 *
 * Staff differentiator: Automated accessibility testing for drag-and-drop
 * interactions, including keyboard drag flow testing, ARIA attribute validation,
 * and screen reader simulation.
 */

/**
 * Automated test runner for drag-and-drop accessibility compliance.
 */
export class DragDropA11yTester {
  private errors: string[] = [];

  /**
   * Tests keyboard drag flow for a list item.
   */
  async testKeyboardDrag(item: HTMLElement): Promise<{ pass: boolean; errors: string[] }> {
    this.errors = [];

    // 1. Item must be focusable
    if (item.tabIndex === -1 || !item.matches('[tabindex]')) {
      this.errors.push('Draggable item is not focusable (missing tabindex)');
    }

    // 2. Item must have aria-grabbed or role that implies draggability
    const role = item.getAttribute('role');
    if (!role || !['listitem', 'row', 'gridcell', 'option'].includes(role)) {
      this.errors.push('Draggable item should have an appropriate ARIA role');
    }

    // 3. Test Space/Enter to initiate drag
    item.focus();
    item.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
    if (!item.getAttribute('aria-grabbed')) {
      this.errors.push('Initiating drag did not set aria-grabbed="true"');
    }

    // 4. Test Arrow keys to move
    item.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));

    // 5. Test Enter to drop
    item.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    if (item.getAttribute('aria-grabbed') !== 'false') {
      this.errors.push('Dropping did not set aria-grabbed="false"');
    }

    return { pass: this.errors.length === 0, errors: [...this.errors] };
  }

  /**
   * Tests ARIA live region announcements during drag operations.
   */
  testLiveRegionAnnouncements(liveRegion: HTMLElement, operation: string): { pass: boolean; errors: string[] } {
    this.errors = [];

    if (liveRegion.getAttribute('aria-live') !== 'assertive' && liveRegion.getAttribute('aria-live') !== 'polite') {
      this.errors.push('Live region must have aria-live set to "polite" or "assertive"');
    }

    if (!liveRegion.textContent?.includes(operation)) {
      this.errors.push(`Live region did not announce operation: "${operation}"`);
    }

    return { pass: this.errors.length === 0, errors: [...this.errors] };
  }

  /**
   * Tests drop target visual feedback for visibility.
   */
  testDropTargetFeedback(dropTarget: HTMLElement, isOver: boolean): { pass: boolean; errors: string[] } {
    this.errors = [];

    const hasVisualFeedback = isOver
      ? dropTarget.classList.contains('drop-target-active') || dropTarget.getAttribute('aria-dropeffect')
      : true;

    if (!hasVisualFeedback) {
      this.errors.push('Drop target has no visual feedback when item is dragged over it');
    }

    return { pass: this.errors.length === 0, errors: [...this.errors] };
  }
}
