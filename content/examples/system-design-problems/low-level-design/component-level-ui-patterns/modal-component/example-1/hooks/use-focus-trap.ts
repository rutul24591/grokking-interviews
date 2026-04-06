import { useEffect, useRef, useCallback } from 'react';

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable]',
].join(', ');

/**
 * useFocusTrap — traps keyboard focus within a container element.
 *
 * When the user presses Tab, focus cycles among focusable elements
 * within the container. Shift+Tab reverses the cycle. Focus wraps
 * from the last element to the first (and vice versa).
 *
 * On cleanup, focus is restored to the element that was focused
 * before the trap was activated.
 *
 * @param containerRef - Ref to the modal container element
 * @param isActive - Whether the focus trap should be active
 */
export function useFocusTrap(
  containerRef: React.RefObject<HTMLElement | null>,
  isActive: boolean
) {
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !containerRef.current) return;

      const focusableElements = Array.from(
        containerRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
      ).filter(
        (el) =>
          !el.hasAttribute('disabled') &&
          !el.getAttribute('aria-hidden') &&
          el.offsetParent !== null // visible
      );

      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        // Shift+Tab: if on first element, wrap to last
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab: if on last element, wrap to first
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    },
    [containerRef]
  );

  useEffect(() => {
    if (!isActive) return;

    // Store the currently focused element so we can restore it later
    previousFocusRef.current = document.activeElement as HTMLElement | null;

    // If the modal has no focusable elements, make the container itself focusable
    if (containerRef.current) {
      const focusableElements = containerRef.current.querySelectorAll(FOCUSABLE_SELECTOR);
      if (focusableElements.length === 0) {
        containerRef.current.setAttribute('tabindex', '-1');
      }
    }

    // Focus the first focusable element inside the modal
    requestAnimationFrame(() => {
      if (containerRef.current) {
        const focusableElements = Array.from(
          containerRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
        );
        if (focusableElements.length > 0) {
          focusableElements[0].focus();
        } else {
          // No focusable elements — focus the container itself
          containerRef.current.focus();
        }
      }
    });

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);

      // Restore focus to the element that was focused before the modal opened
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
        previousFocusRef.current = null;
      }
    };
  }, [isActive, containerRef, handleKeyDown]);
}
