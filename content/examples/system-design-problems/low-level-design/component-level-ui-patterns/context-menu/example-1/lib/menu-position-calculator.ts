import type { MenuPosition } from './context-menu-types';

export interface PositionCalculatorOptions {
  /** Estimated or measured menu width in pixels */
  menuWidth: number;
  /** Estimated or measured menu height in pixels */
  menuHeight: number;
  /** Minimum margin from cursor and viewport edges (default: 8) */
  margin?: number;
  /** Viewport width (default: window.innerWidth) */
  viewportWidth?: number;
  /** Viewport height (default: window.innerHeight) */
  viewportHeight?: number;
}

/**
 * Calculates the optimal menu position given cursor coordinates and viewport boundaries.
 * Returns adjusted coordinates with flip flags if the menu would overflow the viewport.
 */
export function calculateMenuPosition(
  cursorX: number,
  cursorY: number,
  options: PositionCalculatorOptions
): MenuPosition {
  const {
    menuWidth,
    menuHeight,
    margin = 8,
    viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1024,
    viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 768,
  } = options;

  let x = cursorX + margin;
  let y = cursorY + margin;
  let flipX = false;
  let flipY = false;

  // Check right edge overflow
  if (x + menuWidth > viewportWidth) {
    x = cursorX - menuWidth - margin;
    flipX = true;
  }

  // Check bottom edge overflow
  if (y + menuHeight > viewportHeight) {
    y = cursorY - menuHeight - margin;
    flipY = true;
  }

  // Clamp to viewport edges (ensure menu is never fully off-screen)
  x = Math.max(margin, Math.min(x, viewportWidth - menuWidth - margin));
  y = Math.max(margin, Math.min(y, viewportHeight - menuHeight - margin));

  return { x, y, flipX, flipY };
}

/**
 * Calculates sub-menu fly-out position relative to a parent menu item.
 * By default, sub-menus appear to the right of the parent item.
 * If near the right viewport edge, they flip to the left.
 */
export function calculateSubMenuPosition(
  parentItemRect: DOMRect,
  subMenuWidth: number,
  subMenuHeight: number,
  options?: { margin?: number; viewportWidth?: number; viewportHeight?: number }
): MenuPosition {
  const {
    margin = 4,
    viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1024,
    viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 768,
  } = options || {};

  // Default: position to the right of parent item, aligned to parent's top
  let x = parentItemRect.right + margin;
  let y = parentItemRect.top;
  let flipX = false;
  let flipY = false;

  // Check right edge overflow — flip to left side of parent
  if (x + subMenuWidth > viewportWidth) {
    x = parentItemRect.left - subMenuWidth - margin;
    flipX = true;
  }

  // Check bottom edge overflow — align to bottom of viewport
  if (y + subMenuHeight > viewportHeight) {
    y = Math.max(margin, viewportHeight - subMenuHeight - margin);
    flipY = true;
  }

  // Check top edge overflow
  if (y < margin) {
    y = margin;
    flipY = true;
  }

  return { x, y, flipX, flipY };
}
