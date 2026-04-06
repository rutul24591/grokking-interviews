'use client';

import React from 'react';
import { useContextMenu } from '../hooks/use-context-menu';
import type { MenuItem } from '../lib/context-menu-types';

interface ContextMenuTriggerProps {
  children: React.ReactNode;
  items: MenuItem[];
  getItems?: (element: HTMLElement) => MenuItem[];
  className?: string;
}

/**
 * Wrapper component that captures contextmenu, long-press, and keyboard events.
 * Attach any element as children — the ref is forwarded automatically.
 */
export function ContextMenuTrigger({
  children,
  items,
  getItems,
  className,
}: ContextMenuTriggerProps) {
  const { ref } = useContextMenu({ items, getItems });

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={className}
      role="application"
      aria-label="Context menu trigger area"
    >
      {children}
    </div>
  );
}
