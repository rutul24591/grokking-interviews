'use client';

import { useCallback } from 'react';
import type { PaneDividerProps, SplitPaneOrientation } from '../lib/split-pane-types';

/**
 * Draggable divider component between two panes.
 * Supports pointer-based drag, keyboard resize, double-click collapse,
 * and full accessibility with ARIA separator semantics.
 */
export function PaneDivider({
  orientation,
  isDragging,
  pane1Size,
  minSize,
  maxSize,
  onPointerDown,
  onDoubleClick,
  onKeyDown,
  onCollapseToggle,
  transition = true,
  className = '',
}: PaneDividerProps) {
  const cursor = orientation === 'horizontal' ? 'cursor-col-resize' : 'cursor-row-resize';

  const handleDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      onDoubleClick();
    },
    [onDoubleClick],
  );

  const sizeLabel = orientation === 'horizontal'
    ? `Left panel: ${Math.round(pane1Size)}%`
    : `Top panel: ${Math.round(pane1Size)}%`;

  return (
    <div
      role="separator"
      aria-orientation={orientation}
      aria-valuenow={Math.round(pane1Size)}
      aria-valuemin={Math.round(minSize)}
      aria-valuemax={Math.round(maxSize)}
      aria-label={sizeLabel}
      tabIndex={0}
      className={`flex-shrink-0 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${cursor} ${className}`}
      style={{
        ...(orientation === 'horizontal'
          ? { width: '4px', margin: '0 -2px', zIndex: 10 }
          : { height: '4px', margin: '-2px 0', zIndex: 10 }),
        transition: transition ? 'background-color 150ms ease' : 'none',
        backgroundColor: isDragging ? '#3b82f6' : 'transparent',
      }}
      onPointerDown={onPointerDown}
      onDoubleClick={handleDoubleClick}
      onKeyDown={onKeyDown}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.backgroundColor = '#93c5fd';
      }}
      onMouseLeave={(e) => {
        if (!isDragging) {
          (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
        }
      }}
      data-testid="pane-divider"
    >
      {/* Grip handle indicator */}
      <div
        className="absolute flex items-center justify-center"
        style={{
          ...(orientation === 'horizontal'
            ? { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }
            : { top: '50%', left: '50%', transform: 'translate(-50%, -50%) rotate(90deg)' }),
        }}
      >
        <svg
          width="12"
          height="16"
          viewBox="0 0 12 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="opacity-40"
          aria-hidden="true"
        >
          <circle cx="3" cy="2" r="1.5" fill="currentColor" />
          <circle cx="9" cy="2" r="1.5" fill="currentColor" />
          <circle cx="3" cy="8" r="1.5" fill="currentColor" />
          <circle cx="9" cy="8" r="1.5" fill="currentColor" />
          <circle cx="3" cy="14" r="1.5" fill="currentColor" />
          <circle cx="9" cy="14" r="1.5" fill="currentColor" />
        </svg>
      </div>
    </div>
  );
}
