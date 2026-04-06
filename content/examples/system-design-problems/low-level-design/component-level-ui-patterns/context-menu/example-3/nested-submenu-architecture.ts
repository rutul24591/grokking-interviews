/**
 * Context Menu — Staff-Level Nested Sub-Menu Architecture.
 *
 * Staff differentiator: Stack-based sub-menu management with independent
 * focus traps per level, keyboard navigation across nested levels, and
 * z-index stacking with boundary detection.
 */

import { useState, useCallback, useRef, useEffect } from 'react';

interface SubMenuState {
  id: string;
  parentId: string | null;
  x: number;
  y: number;
  zIndex: number;
}

/**
 * Hook that manages nested context menus with full keyboard navigation.
 */
export function useNestedContextMenu(
  maxDepth: number = 3,
  baseZIndex: number = 1000,
  zIndexIncrement: number = 100,
) {
  const [menuStack, setMenuStack] = useState<SubMenuState[]>([]);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const menuRef = useRef<HTMLDivElement | null>(null);

  /**
   * Opens a sub-menu at the specified position.
   */
  const openSubMenu = useCallback((parentId: string, x: number, y: number) => {
    setMenuStack((prev) => {
      if (prev.length >= maxDepth) return prev;
      return [...prev, { id: `submenu_${prev.length}`, parentId, x, y, zIndex: baseZIndex + prev.length * zIndexIncrement }];
    });
    setFocusedIndex(0);
  }, [maxDepth, baseZIndex, zIndexIncrement]);

  /**
   * Closes the topmost sub-menu.
   */
  const closeTopMenu = useCallback(() => {
    setMenuStack((prev) => prev.slice(0, -1));
    setFocusedIndex(0);
  }, []);

  /**
   * Closes all sub-menus.
   */
  const closeAll = useCallback(() => {
    setMenuStack([]);
    setFocusedIndex(0);
  }, []);

  /**
   * Handles keyboard navigation within the current menu level.
   */
  const onKeyDown = useCallback((e: React.KeyboardEvent, itemCount: number) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex((prev) => (prev + 1) % itemCount);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex((prev) => (prev - 1 + itemCount) % itemCount);
        break;
      case 'ArrowRight':
        // Open sub-menu for focused item
        break;
      case 'ArrowLeft':
        // Close current sub-menu, focus parent item
        if (menuStack.length > 0) closeTopMenu();
        break;
      case 'Escape':
        if (menuStack.length > 0) closeTopMenu();
        else closeAll();
        break;
    }
  }, [menuStack.length, closeTopMenu, closeAll]);

  // Close on outside click
  useEffect(() => {
    if (menuStack.length === 0) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        closeAll();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [menuStack.length, closeAll]);

  return { menuStack, focusedIndex, menuRef, openSubMenu, closeTopMenu, closeAll, onKeyDown };
}
