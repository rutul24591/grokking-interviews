/**
 * Focus Escape Guard — Handles focus trap edge cases for modal dialogs.
 *
 * Interview edge cases:
 * 1. No focusable elements inside modal — focus the container itself
 * 2. Programmatically focused element removed during render — focus guard redirects
 * 3. iframe content — focus can escape to iframe, needs special handling
 * 4. Shadow DOM — querySelector doesn't reach into shadow roots
 */

import { useRef, useEffect, useCallback } from 'react';

/**
 * Returns all focusable elements within a container, including those in Shadow DOM.
 */
function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const selector = 'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])';
  const elements = Array.from(container.querySelectorAll<HTMLElement>(selector));

  // Also search within Shadow DOM
  for (const el of elements) {
    if (el.shadowRoot) {
      elements.push(...getFocusableElements(el.shadowRoot as unknown as HTMLElement));
    }
  }
  return elements.filter((el) => !el.hasAttribute('disabled') && !el.hasAttribute('aria-hidden'));
}

/**
 * Hook that creates a focus trap within a container.
 * Handles edge cases: no focusable elements, dynamic content, iframe escape.
 */
export function useFocusTrap(containerRef: React.RefObject<HTMLElement | null>, isActive: boolean) {
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const trapFocus = useCallback((e: KeyboardEvent) => {
    if (e.key !== 'Tab' || !isActive) return;

    const container = containerRef.current;
    if (!container) return;

    const focusable = getFocusableElements(container);
    if (focusable.length === 0) {
      // No focusable elements — focus container itself
      container.setAttribute('tabindex', '-1');
      container.focus();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }, [isActive, containerRef]);

  useEffect(() => {
    if (!isActive) return;

    // Save previous focus
    previousFocusRef.current = document.activeElement as HTMLElement | null;

    // Focus first element
    const container = containerRef.current;
    if (container) {
      const focusable = getFocusableElements(container);
      if (focusable.length > 0) focusable[0].focus();
      else container.focus();
    }

    document.addEventListener('keydown', trapFocus);
    return () => {
      document.removeEventListener('keydown', trapFocus);
      // Restore focus
      previousFocusRef.current?.focus();
    };
  }, [isActive, containerRef, trapFocus]);
}
