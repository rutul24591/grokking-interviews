'use client';

import type { PanePanelProps } from '../lib/split-pane-types';

/**
 * Individual panel within a SplitPane.
 * Computes flex-basis from the provided size and supports
 * optional CSS transitions for smooth resize animations.
 */
export function PanePanel({
  size,
  transition = true,
  transitionDuration = 200,
  className = '',
  children,
}: PanePanelProps) {
  const transitionStyle = transition
    ? `flex-basis ${transitionDuration}ms ease-out`
    : 'none';

  return (
    <div
      className={`overflow-auto ${className}`}
      style={{
        flexBasis: `${size.percentage}%`,
        flexShrink: 0,
        transition: transitionStyle,
        minWidth: 0,
        minHeight: 0,
      }}
      data-pane-size={size.percentage.toFixed(2)}
      data-pane-pixels={Math.round(size.pixels)}
    >
      {children}
    </div>
  );
}
