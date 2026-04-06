/**
 * Determines the fill value (0.5 or 1.0) for a star based on mouse position.
 *
 * If the mouse is in the left half of the star element, returns 0.5 (half-fill).
 * If the mouse is in the right half, returns 1.0 (full-fill).
 *
 * @param clientX - The mouse event's clientX coordinate
 * @param element - The star DOM element
 * @returns 0.5 if mouse is in the left half, 1.0 if in the right half
 */
export function getHoverFillValue(clientX: number, element: Element): 0.5 | 1 {
  const rect = element.getBoundingClientRect();
  const relativeX = clientX - rect.left;
  const ratio = relativeX / rect.width;

  return ratio > 0.5 ? 1 : 0.5;
}

/**
 * Computes the effective rating value for a hover event on a specific star.
 *
 * @param starIndex - The 0-based index of the star being hovered
 * @param fillValue - The fill value from getHoverFillValue (0.5 or 1.0)
 * @returns The effective rating (e.g., star index 2 with fillValue 0.5 returns 2.5)
 */
export function computeHoverValue(starIndex: number, fillValue: 0.5 | 1): number {
  return starIndex + fillValue;
}
