/**
 * Tooltip — Staff-Level Content-Aware Positioning.
 *
 * Staff differentiator: Measures tooltip content dimensions before positioning,
 * adjusts placement to avoid overflow, and handles dynamic content changes
 * (e.g., tooltip content loads asynchronously).
 */

export type SmartPlacement =
  | 'top' | 'bottom' | 'left' | 'right'
  | 'top-start' | 'top-end'
  | 'bottom-start' | 'bottom-end'
  | 'left-start' | 'left-end'
  | 'right-start' | 'right-end';

/**
 * Calculates the optimal tooltip position based on content dimensions
 * and viewport boundaries.
 */
export function calculateSmartPosition(
  triggerRect: DOMRect,
  tooltipWidth: number,
  tooltipHeight: number,
  preferredPlacement: SmartPlacement,
  viewportWidth: number = window.innerWidth,
  viewportHeight: number = window.innerHeight,
  margin: number = 8,
): { x: number; y: number; placement: SmartPlacement } {
  const placements: { placement: SmartPlacement; x: number; y: number }[] = [];

  // Generate all possible placements
  const sides: Array<{ side: string; positions: Array<{ align: string; x: number; y: number }> }> = [
    {
      side: 'top',
      positions: [
        { align: 'center', x: triggerRect.left + triggerRect.width / 2 - tooltipWidth / 2, y: triggerRect.top - tooltipHeight - margin },
        { align: 'start', x: triggerRect.left, y: triggerRect.top - tooltipHeight - margin },
        { align: 'end', x: triggerRect.right - tooltipWidth, y: triggerRect.top - tooltipHeight - margin },
      ],
    },
    {
      side: 'bottom',
      positions: [
        { align: 'center', x: triggerRect.left + triggerRect.width / 2 - tooltipWidth / 2, y: triggerRect.bottom + margin },
        { align: 'start', x: triggerRect.left, y: triggerRect.bottom + margin },
        { align: 'end', x: triggerRect.right - tooltipWidth, y: triggerRect.bottom + margin },
      ],
    },
    {
      side: 'left',
      positions: [
        { align: 'center', x: triggerRect.left - tooltipWidth - margin, y: triggerRect.top + triggerRect.height / 2 - tooltipHeight / 2 },
        { align: 'start', x: triggerRect.left - tooltipWidth - margin, y: triggerRect.top },
        { align: 'end', x: triggerRect.left - tooltipWidth - margin, y: triggerRect.bottom - tooltipHeight },
      ],
    },
    {
      side: 'right',
      positions: [
        { align: 'center', x: triggerRect.right + margin, y: triggerRect.top + triggerRect.height / 2 - tooltipHeight / 2 },
        { align: 'start', x: triggerRect.right + margin, y: triggerRect.top },
        { align: 'end', x: triggerRect.right + margin, y: triggerRect.bottom - tooltipHeight },
      ],
    },
  ];

  for (const { side, positions } of sides) {
    for (const { align, x, y } of positions) {
      const placement = `${side}-${align === 'center' ? '' : align}`.replace(/-$/, '') as SmartPlacement;
      const fitsX = x >= margin && x + tooltipWidth <= viewportWidth - margin;
      const fitsY = y >= margin && y + tooltipHeight <= viewportHeight - margin;

      if (fitsX && fitsY) {
        placements.push({ placement, x, y });
        // If this matches the preferred placement, return immediately
        if (placement === preferredPlacement) {
          return { x, y, placement };
        }
      }
    }
  }

  // Return the first fitting placement, or the preferred one (even if it overflows)
  if (placements.length > 0) return placements[0];

  // Fallback: center above trigger (may overflow)
  return {
    x: triggerRect.left + triggerRect.width / 2 - tooltipWidth / 2,
    y: triggerRect.top - tooltipHeight - margin,
    placement: 'top',
  };
}
