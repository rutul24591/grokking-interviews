'use client';

import React from 'react';

/**
 * Horizontal divider line between menu item groups.
 */
export function ContextMenuSeparator() {
  return (
    <div
      role="separator"
      aria-orientation="horizontal"
      className="my-1 h-px bg-border"
    />
  );
}
