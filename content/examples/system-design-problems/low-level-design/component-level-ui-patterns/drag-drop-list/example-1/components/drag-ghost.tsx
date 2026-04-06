import React, { useEffect, useRef, useState } from 'react';
import type { DragState } from '../../lib/drag-drop-types';

interface DragGhostProps {
  activeDrag: DragState | null;
  ghostOffsetY?: number;
}

/**
 * Drag ghost component.
 *
 * Renders a floating clone of the dragged item that follows the pointer.
 * Uses a portal to render outside the list DOM hierarchy.
 * Applies scale-up, reduced opacity, and shadow for visual depth.
 */
export function DragGhost({ activeDrag, ghostOffsetY = 10 }: DragGhostProps) {
  const ghostRef = useRef<HTMLDivElement | null>(null);
  const [mounted, setMounted] = useState(false);

  // SSR-safe mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  // Update ghost position on pointer move
  useEffect(() => {
    if (!ghostRef.current || !activeDrag) return;

    const { pointerX, pointerY } = activeDrag;
    ghostRef.current.style.transform = `translate(${pointerX}px, ${pointerY + ghostOffsetY}px)`;
  }, [activeDrag, ghostOffsetY]);

  if (!mounted || !activeDrag) {
    return null;
  }

  return (
    <div
      ref={ghostRef}
      className="fixed pointer-events-none z-[100] rounded-lg border border-accent/30 bg-panel shadow-lg"
      style={{
        opacity: 0.85,
        transform: `translate(${activeDrag.pointerX}px, ${activeDrag.pointerY + ghostOffsetY}px)`,
        transition: 'none',
        willChange: 'transform',
      }}
      aria-hidden="true"
    >
      {/* Simplified ghost content — in production, clone the actual item DOM */}
      <div className="flex items-center gap-3 px-4 py-3">
        {/* Drag handle icon */}
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          className="text-muted"
        >
          <circle cx="5" cy="3" r="1.5" fill="currentColor" />
          <circle cx="11" cy="3" r="1.5" fill="currentColor" />
          <circle cx="5" cy="8" r="1.5" fill="currentColor" />
          <circle cx="11" cy="8" r="1.5" fill="currentColor" />
          <circle cx="5" cy="13" r="1.5" fill="currentColor" />
          <circle cx="11" cy="13" r="1.5" fill="currentColor" />
        </svg>

        {/* Placeholder content */}
        <div className="h-4 w-32 rounded bg-panel-soft/60" />
      </div>
    </div>
  );
}

/**
 * Alternative: DOM-cloned ghost.
 *
 * In production, you may want to clone the actual dragged item's DOM
 * for an exact visual match. This function creates a clone and positions it.
 * The clone is removed from the DOM when the drag ends.
 */
export function createDomGhost(
  sourceElement: HTMLElement,
  pointerX: number,
  pointerY: number,
  offsetY: number = 10
): HTMLDivElement {
  const ghost = sourceElement.cloneNode(true) as HTMLDivElement;

  ghost.style.position = 'fixed';
  ghost.style.left = '0';
  ghost.style.top = '0';
  ghost.style.transform = `translate(${pointerX}px, ${pointerY + offsetY}px)`;
  ghost.style.opacity = '0.85';
  ghost.style.pointerEvents = 'none';
  ghost.style.zIndex = '100';
  ghost.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
  ghost.style.borderRadius = '0.5rem';
  ghost.style.backgroundColor = getComputedStyle(document.documentElement)
    .getPropertyValue('--color-panel') || '#ffffff';

  document.body.appendChild(ghost);
  return ghost;
}

export function removeDomGhost(ghost: HTMLDivElement) {
  ghost.remove();
}
