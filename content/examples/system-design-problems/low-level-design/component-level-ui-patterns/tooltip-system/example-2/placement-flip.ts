/**
 * Placement Flip — Auto-flips tooltip position when it would overflow viewport.
 *
 * Interview edge case: Tooltip is positioned "top-center" but the trigger element
 * is near the top of the viewport. The tooltip would render off-screen. Solution:
 * detect boundary collision and flip to the opposite placement (bottom-center).
 */

export type TooltipPlacement =
  | 'top-start' | 'top-center' | 'top-end'
  | 'bottom-start' | 'bottom-center' | 'bottom-end'
  | 'left-start' | 'left-center' | 'left-end'
  | 'right-start' | 'right-center' | 'right-end';

const FLIP_MAP: Record<string, TooltipPlacement> = {
  'top-start': 'bottom-start', 'top-center': 'bottom-center', 'top-end': 'bottom-end',
  'bottom-start': 'top-start', 'bottom-center': 'top-center', 'bottom-end': 'top-end',
  'left-start': 'right-start', 'left-center': 'right-center', 'left-end': 'right-end',
  'right-start': 'left-start', 'right-center': 'left-center', 'right-end': 'left-end',
};

const MARGIN = 8;

interface PlacementResult {
  placement: TooltipPlacement;
  x: number;
  y: number;
  wasFlipped: boolean;
}

/**
 * Calculates tooltip position with auto-flip on viewport boundary collision.
 */
export function calculateTooltipPosition(
  triggerRect: DOMRect,
  tooltipWidth: number,
  tooltipHeight: number,
  preferredPlacement: TooltipPlacement,
  viewportWidth: number = window.innerWidth,
  viewportHeight: number = window.innerHeight,
): PlacementResult {
  let { x, y } = getBasePosition(triggerRect, tooltipWidth, tooltipHeight, preferredPlacement);
  const [side] = preferredPlacement.split('-') as [string];
  const placementKey = `${side}-${preferredPlacement.split('-')[1] || 'center'}`;

  let wasFlipped = false;

  // Check boundary collisions and flip
  if (side === 'top' && y < MARGIN) {
    preferredPlacement = FLIP_MAP[preferredPlacement];
    ({ x, y } = getBasePosition(triggerRect, tooltipWidth, tooltipHeight, preferredPlacement));
    wasFlipped = true;
  }
  if (side === 'bottom' && y + tooltipHeight > viewportHeight - MARGIN) {
    preferredPlacement = FLIP_MAP[preferredPlacement];
    ({ x, y } = getBasePosition(triggerRect, tooltipWidth, tooltipHeight, preferredPlacement));
    wasFlipped = true;
  }
  if (side === 'left' && x < MARGIN) {
    preferredPlacement = FLIP_MAP[preferredPlacement];
    ({ x, y } = getBasePosition(triggerRect, tooltipWidth, tooltipHeight, preferredPlacement));
    wasFlipped = true;
  }
  if (side === 'right' && x + tooltipWidth > viewportWidth - MARGIN) {
    preferredPlacement = FLIP_MAP[preferredPlacement];
    ({ x, y } = getBasePosition(triggerRect, tooltipWidth, tooltipHeight, preferredPlacement));
    wasFlipped = true;
  }

  // Clamp to viewport
  x = Math.max(MARGIN, Math.min(x, viewportWidth - tooltipWidth - MARGIN));
  y = Math.max(MARGIN, Math.min(y, viewportHeight - tooltipHeight - MARGIN));

  return { placement: preferredPlacement, x, y, wasFlipped };
}

function getBasePosition(
  triggerRect: DOMRect,
  tooltipWidth: number,
  tooltipHeight: number,
  placement: TooltipPlacement,
): { x: number; y: number } {
  const [side, align] = placement.split('-') as [string, string | undefined];
  let x = 0, y = 0;

  switch (side) {
    case 'top': y = triggerRect.top - tooltipHeight - 8; break;
    case 'bottom': y = triggerRect.bottom + 8; break;
    case 'left': x = triggerRect.left - tooltipWidth - 8; break;
    case 'right': x = triggerRect.right + 8; break;
  }

  switch (align) {
    case 'start':
      x = side === 'top' || side === 'bottom' ? triggerRect.left : triggerRect.top;
      break;
    case 'end':
      x = side === 'top' || side === 'bottom' ? triggerRect.right - tooltipWidth : triggerRect.bottom - tooltipHeight;
      break;
    default: // center
      if (side === 'top' || side === 'bottom') {
        x = triggerRect.left + triggerRect.width / 2 - tooltipWidth / 2;
      } else {
        y = triggerRect.top + triggerRect.height / 2 - tooltipHeight / 2;
      }
  }

  return { x, y };
}
