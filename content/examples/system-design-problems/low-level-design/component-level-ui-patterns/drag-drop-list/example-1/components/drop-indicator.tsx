import React, { useEffect, useState } from 'react';
import type { DropTarget } from '../../lib/drag-drop-types';

interface DropIndicatorProps {
  dropTarget: DropTarget | null;
  containerRef: React.RefObject<HTMLElement | null>;
}

/**
 * Drop indicator component.
 *
 * Renders a thin horizontal line at the computed drop position.
 * Positioned absolutely to avoid affecting the list layout.
 * Uses a pulsing animation to draw attention.
 */
export function DropIndicator({ dropTarget, containerRef }: DropIndicatorProps) {
  const [position, setPosition] = useState<{ top: number; left: number; width: number } | null>(null);

  useEffect(() => {
    if (!dropTarget || !containerRef.current) {
      setPosition(null);
      return;
    }

    // Find the target element in the DOM
    const targetElement = containerRef.current.querySelector<HTMLElement>(
      `[data-item-id="${dropTarget.itemId}"]`
    );

    if (!targetElement) {
      setPosition(null);
      return;
    }

    const rect = targetElement.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();

    setPosition({
      top:
        dropTarget.position === 'before'
          ? rect.top - containerRect.top
          : rect.bottom - containerRect.top,
      left: 0,
      width: rect.width,
    });
  }, [dropTarget, containerRef]);

  if (!position || !dropTarget) {
    return null;
  }

  return (
    <div
      className="pointer-events-none absolute z-10 h-0.5 bg-accent animate-pulse"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        width: `${position.width}px`,
      }}
      aria-hidden="true"
    >
      {/* Indicator endpoints */}
      <div className="absolute left-0 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-accent" />
      <div className="absolute right-0 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-accent" />
    </div>
  );
}
