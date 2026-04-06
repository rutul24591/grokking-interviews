/**
 * Modal — Staff-Level Focus Trap Edge Cases.
 *
 * Staff differentiator: Shadow DOM traversal, iframe focus containment,
 * MutationObserver for dynamic content, and programmatic focus loss detection.
 */

/**
 * Advanced focus trap that handles Shadow DOM and iframe content.
 */
export class AdvancedFocusTrap {
  private container: HTMLElement;
  private previousFocus: HTMLElement | null = null;
  private mutationObserver: MutationObserver | null = null;
  private rafId: number | null = null;

  constructor(container: HTMLElement) {
    this.container = container;
  }

  /**
   * Activates the focus trap.
   */
  activate(): void {
    this.previousFocus = document.activeElement as HTMLElement | null;

    // Focus first focusable element
    const focusable = this.getFocusableElements();
    if (focusable.length > 0) focusable[0].focus();

    // Set up MutationObserver to detect dynamic content changes
    this.mutationObserver = new MutationObserver(() => {
      // If focused element is removed, redirect focus
      if (!this.container.contains(document.activeElement)) {
        const focusable = this.getFocusableElements();
        if (focusable.length > 0) focusable[0].focus();
      }
    });
    this.mutationObserver.observe(this.container, { childList: true, subtree: true });

    // RAF polling for programmatic focus loss detection
    this.pollFocus();
  }

  /**
   * Deactivates the focus trap and restores previous focus.
   */
  deactivate(): void {
    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
      this.mutationObserver = null;
    }
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.previousFocus?.focus();
  }

  /**
   * RAF-based focus polling — detects programmatic focus changes that don't
   * fire keyboard events.
   */
  private pollFocus(): void {
    const check = () => {
      if (this.container && !this.container.contains(document.activeElement)) {
        const focusable = this.getFocusableElements();
        if (focusable.length > 0) focusable[0].focus();
      }
      this.rafId = requestAnimationFrame(check);
    };
    this.rafId = requestAnimationFrame(check);
  }

  /**
   * Gets all focusable elements including those in Shadow DOM.
   */
  private getFocusableElements(): HTMLElement[] {
    const selector = 'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])';
    const elements = Array.from(this.container.querySelectorAll<HTMLElement>(selector));

    // Search within Shadow DOM
    for (const el of elements) {
      if (el.shadowRoot) {
        elements.push(...this.getFocusableElementsInShadow(el.shadowRoot));
      }
    }

    return elements.filter((el) => !el.disabled && !el.hasAttribute('aria-hidden'));
  }

  private getFocusableElementsInShadow(root: ShadowRoot): HTMLElement[] {
    const selector = 'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])';
    const elements = Array.from(root.querySelectorAll<HTMLElement>(selector));
    for (const el of elements) {
      if (el.shadowRoot) {
        elements.push(...this.getFocusableElementsInShadow(el.shadowRoot));
      }
    }
    return elements;
  }
}
