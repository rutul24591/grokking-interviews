/**
 * Boundary Flip for Context Menu — Flips position when near viewport edge.
 *
 * Interview edge case: User right-clicks near the bottom-right corner of the
 * viewport. The menu would render off-screen. Solution: detect boundary collision
 * and flip to the opposite side (top-left instead of bottom-right).
 */

export interface MenuPosition {
  x: number;
  y: number;
  flippedX: boolean;
  flippedY: boolean;
}

const MARGIN = 8;

/**
 * Calculates context menu position with auto-flip on viewport boundary collision.
 */
export function calculateMenuPosition(
  clickX: number,
  clickY: number,
  menuWidth: number,
  menuHeight: number,
  viewportWidth: number = window.innerWidth,
  viewportHeight: number = window.innerHeight,
): MenuPosition {
  let x = clickX;
  let y = clickY;
  let flippedX = false;
  let flippedY = false;

  // Flip horizontally if menu would overflow right edge
  if (x + menuWidth > viewportWidth - MARGIN) {
    x = clickX - menuWidth;
    flippedX = true;
  }

  // Flip vertically if menu would overflow bottom edge
  if (y + menuHeight > viewportHeight - MARGIN) {
    y = clickY - menuHeight;
    flippedY = true;
  }

  // Clamp to viewport
  x = Math.max(MARGIN, Math.min(x, viewportWidth - menuWidth - MARGIN));
  y = Math.max(MARGIN, Math.min(y, viewportHeight - menuHeight - MARGIN));

  return { x, y, flippedX, flippedY };
}
