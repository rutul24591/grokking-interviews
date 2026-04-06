// Tooltip Position Engine — 12 placement calculations, auto-flip, arrow positioning

import type {
  TooltipPlacement,
  TooltipPosition,
  TooltipArrowPosition,
} from "../lib/tooltip-types";

interface PositionInput {
  triggerRect: DOMRect;
  tooltipWidth: number;
  tooltipHeight: number;
  placement: TooltipPlacement;
  viewportWidth: number;
  viewportHeight: number;
  arrowSize: number;
  gap: number;
}

const GAP_DEFAULT = 8;
const VIEWPORT_PADDING = 8;
const ARROW_SIZE_DEFAULT = 6;

function getFlipPlacement(placement: TooltipPlacement): TooltipPlacement {
  const [axis, alignment] = placement.split("-") as [string, string];
  const flipMap: Record<string, string> = {
    top: "bottom",
    bottom: "top",
    left: "right",
    right: "left",
  };
  const flippedAxis = flipMap[axis] ?? axis;
  return `${flippedAxis}-${alignment}` as TooltipPlacement;
}

function computePositionForPlacement(
  placement: TooltipPlacement,
  triggerRect: DOMRect,
  tooltipWidth: number,
  tooltipHeight: number,
  gap: number,
  arrowSize: number
): { top: number; left: number } {
  const [axis, alignment] = placement.split("-") as [string, string];

  let top = 0;
  let left = 0;

  // Primary axis positioning
  switch (axis) {
    case "top":
      top = triggerRect.top - tooltipHeight - gap;
      break;
    case "bottom":
      top = triggerRect.bottom + gap;
      break;
    case "left":
      left = triggerRect.left - tooltipWidth - gap;
      break;
    case "right":
      left = triggerRect.right + gap;
      break;
  }

  // Secondary alignment
  switch (axis) {
    case "top":
    case "bottom":
      switch (alignment) {
        case "start":
          left = triggerRect.left;
          break;
        case "center":
          left = triggerRect.left + triggerRect.width / 2 - tooltipWidth / 2;
          break;
        case "end":
          left = triggerRect.right - tooltipWidth;
          break;
      }
      break;
    case "left":
    case "right":
      switch (alignment) {
        case "start":
          top = triggerRect.top;
          break;
        case "center":
          top = triggerRect.top + triggerRect.height / 2 - tooltipHeight / 2;
          break;
        case "end":
          top = triggerRect.bottom - tooltipHeight;
          break;
      }
      break;
  }

  return { top, left };
}

function checkBoundaryCollision(
  top: number,
  left: number,
  tooltipWidth: number,
  tooltipHeight: number,
  viewportWidth: number,
  viewportHeight: number
): boolean {
  return (
    top < VIEWPORT_PADDING ||
    left < VIEWPORT_PADDING ||
    top + tooltipHeight > viewportHeight - VIEWPORT_PADDING ||
    left + tooltipWidth > viewportWidth - VIEWPORT_PADDING
  );
}

function computeArrowPosition(
  placement: TooltipPlacement,
  triggerRect: DOMRect,
  tooltipTop: number,
  tooltipLeft: number,
  tooltipWidth: number,
  tooltipHeight: number,
  arrowSize: number
): TooltipArrowPosition {
  const [axis, alignment] = placement.split("-") as [string, string];
  let arrowTop = 0;
  let arrowLeft = 0;
  let rotation = 0;

  switch (axis) {
    case "top":
      arrowTop = tooltipHeight - arrowSize / 2;
      rotation = 45;
      break;
    case "bottom":
      arrowTop = -arrowSize / 2;
      rotation = 225;
      break;
    case "left":
      arrowLeft = tooltipWidth - arrowSize / 2;
      rotation = 135;
      break;
    case "right":
      arrowLeft = -arrowSize / 2;
      rotation = 315;
      break;
  }

  // Align arrow with trigger center along the secondary axis
  switch (axis) {
    case "top":
    case "bottom":
      switch (alignment) {
        case "start":
          arrowLeft = triggerRect.left - tooltipLeft + triggerRect.width / 2;
          break;
        case "center":
          arrowLeft = tooltipWidth / 2;
          break;
        case "end":
          arrowLeft = triggerRect.right - tooltipLeft - triggerRect.width / 2;
          break;
      }
      // Clamp arrow within tooltip bounds
      arrowLeft = Math.max(arrowSize, Math.min(tooltipWidth - arrowSize, arrowLeft));
      break;
    case "left":
    case "right":
      switch (alignment) {
        case "start":
          arrowTop = triggerRect.top - tooltipTop + triggerRect.height / 2;
          break;
        case "center":
          arrowTop = tooltipHeight / 2;
          break;
        case "end":
          arrowTop = triggerRect.bottom - tooltipTop - triggerRect.height / 2;
          break;
      }
      // Clamp arrow within tooltip bounds
      arrowTop = Math.max(arrowSize, Math.min(tooltipHeight - arrowSize, arrowTop));
      break;
  }

  return { top: arrowTop, left: arrowLeft, rotation };
}

export function computeTooltipPosition(
  triggerRect: DOMRect,
  tooltipWidth: number,
  tooltipHeight: number,
  preferredPlacement: TooltipPlacement,
  viewportWidth?: number,
  viewportHeight?: number,
  arrowSize?: number,
  gap?: number
): TooltipPosition {
  const vw = viewportWidth ?? window.innerWidth;
  const vh = viewportHeight ?? window.innerHeight;
  const arrow = arrowSize ?? ARROW_SIZE_DEFAULT;
  const g = gap ?? GAP_DEFAULT;

  let placement = preferredPlacement;
  let position = computePositionForPlacement(
    placement,
    triggerRect,
    tooltipWidth,
    tooltipHeight,
    g,
    arrow
  );

  // Check for boundary collision and flip
  if (
    checkBoundaryCollision(
      position.top,
      position.left,
      tooltipWidth,
      tooltipHeight,
      vw,
      vh
    )
  ) {
    placement = getFlipPlacement(placement);
    position = computePositionForPlacement(
      placement,
      triggerRect,
      tooltipWidth,
      tooltipHeight,
      g,
      arrow
    );
  }

  // Compute arrow position
  const arrowPos = computeArrowPosition(
    placement,
    triggerRect,
    position.top,
    position.left,
    tooltipWidth,
    tooltipHeight,
    arrow
  );

  return {
    top: position.top,
    left: position.left,
    resolvedPlacement: placement,
    arrow: arrowPos,
  };
}
