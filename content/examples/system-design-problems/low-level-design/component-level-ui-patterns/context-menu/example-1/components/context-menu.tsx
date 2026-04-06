'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useContextMenuStore } from '../lib/context-menu-store';
import { useOutsideClick } from '../hooks/use-outside-click';
import { handleMenuKeyDown } from '../lib/menu-keyboard-handler';
import { closeAllSubMenus } from '../lib/submenu-manager';
import { ContextMenuItem } from './context-menu-item';
import { ContextMenuSeparator } from './context-menu-separator';
import { ContextMenuSubmenu } from './context-menu-submenu';

export function ContextMenu() {
  const [mounted, setMounted] = useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isOpen = useContextMenuStore((state) => state.isOpen);
  const position = useContextMenuStore((state) => state.position);
  const items = useContextMenuStore((state) => state.items);
  const focusedIndex = useContextMenuStore((state) => state.focusedIndex);
  const subMenuStack = useContextMenuStore((state) => state.subMenuStack);
  const closeMenu = useContextMenuStore((state) => state.closeMenu);

  useOutsideClick(menuRef);

  // SSR-safe mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  // Focus the first item when the menu opens
  useEffect(() => {
    if (isOpen && items.length > 0) {
      requestAnimationFrame(() => {
        const firstItem = menuRef.current?.querySelector(
          '[role="menuitem"]'
        ) as HTMLElement;
        firstItem?.focus();
      });
    }
  }, [isOpen, items.length]);

  // Handle exit animation
  useEffect(() => {
    if (!isOpen && mounted) {
      setIsAnimatingOut(true);
      const timer = setTimeout(() => {
        setIsAnimatingOut(false);
      }, 200); // matches CSS transition duration
      return () => clearTimeout(timer);
    }
  }, [isOpen, mounted]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      handleMenuKeyDown(e, items);
    },
    [items]
  );

  // Cleanup sub-menus when main menu closes
  useEffect(() => {
    if (!isOpen) {
      closeAllSubMenus();
    }
  }, [isOpen]);

  if (!mounted) return null;
  if (!isOpen && !isAnimatingOut) return null;

  const isVisible = isOpen || isAnimatingOut;

  return createPortal(
    <div
      ref={menuRef}
      role="menu"
      aria-label="Context menu"
      tabIndex={-1}
      onKeyDown={handleKeyDown}
      data-context-menu="true"
      className={`
        fixed z-50 min-w-[200px] max-w-[280px] rounded-lg border border-theme
        bg-panel p-1 shadow-xl outline-none
        transition-all duration-200 ease-out
        ${
          isVisible
            ? 'opacity-100 scale-100'
            : 'opacity-0 scale-95'
        }
      `}
      style={{
        left: position ? `${position.x}px` : '0px',
        top: position ? `${position.y}px` : '0px',
      }}
    >
      {items.map((item, index) => {
        if (item.type === 'separator') {
          return <ContextMenuSeparator key={item.id} />;
        }

        const isFocused = index === focusedIndex;

        return (
          <ContextMenuItem
            key={item.id}
            item={item}
            isFocused={isFocused}
            index={index}
          />
        );
      })}

      {/* Render open sub-menus */}
      {subMenuStack.map((entry, stackIndex) => (
        <ContextMenuSubmenu
          key={`submenu-${stackIndex}`}
          items={entry.items}
          position={entry.position}
          stackDepth={stackIndex + 1}
        />
      ))}
    </div>,
    document.body
  );
}
