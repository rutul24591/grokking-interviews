'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import type { MenuPosition, MenuItem } from '../lib/context-menu-types';
import { useContextMenuStore } from '../lib/context-menu-store';
import { handleMenuKeyDown } from '../lib/menu-keyboard-handler';
import { ContextMenuItem } from './context-menu-item';
import { ContextMenuSeparator } from './context-menu-separator';

interface ContextMenuSubmenuProps {
  items: MenuItem[];
  position: MenuPosition;
  stackDepth: number;
}

/**
 * Fly-out sub-menu rendered in a separate portal.
 * Supports nested items with independent focus management.
 */
export function ContextMenuSubmenu({
  items,
  position,
  stackDepth,
}: ContextMenuSubmenuProps) {
  const [mounted, setMounted] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(() => {
    // Find first focusable item
    for (let i = 0; i < items.length; i++) {
      if (items[i].type !== 'separator' && !(items[i].type === 'item' && items[i].disabled)) {
        return i;
      }
    }
    return 0;
  });

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);

    // Focus the first item in the sub-menu
    requestAnimationFrame(() => {
      const firstItem = menuRef.current?.querySelector(
        '[role="menuitem"]'
      ) as HTMLElement;
      firstItem?.focus();
    });

    return () => {
      setMounted(false);
    };
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      // Delegate to the main keyboard handler but with sub-menu items
      const result = handleMenuKeyDown(e, items);

      // Update local focused index for focus styling
      if (result === 'focus-changed') {
        const storeFocused = useContextMenuStore.getState().focusedIndex;
        // The main handler updates the global focusedIndex,
        // but for sub-menu display we track locally
        setFocusedIndex(storeFocused);
      }
    },
    [items]
  );

  if (!mounted) return null;

  // Sub-menus are rendered in a separate portal at the computed position
  return createPortal(
    <div
      ref={menuRef}
      role="menu"
      aria-label="Sub-menu"
      data-context-submenu="true"
      tabIndex={-1}
      onKeyDown={handleKeyDown}
      className={`
        fixed z-[60] min-w-[200px] max-w-[280px] rounded-lg border border-theme
        bg-panel p-1 shadow-xl outline-none
        transition-all duration-150 ease-out
        opacity-100 scale-100
      `}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      {items.map((item, index) => {
        if (item.type === 'separator') {
          return <ContextMenuSeparator key={item.id} />;
        }

        return (
          <ContextMenuItem
            key={item.id}
            item={item}
            isFocused={index === focusedIndex}
            index={index}
          />
        );
      })}
    </div>,
    document.body
  );
}
