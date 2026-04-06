import { useCallback, useEffect, useRef } from 'react';
import { useContextMenuStore } from '../lib/context-menu-store';
import { calculateMenuPosition } from '../lib/menu-position-calculator';
import type { MenuItem } from '../lib/context-menu-types';
import type { UseContextMenuReturn } from '../lib/context-menu-types';

const LONG_PRESS_DURATION = 500; // ms
const MENU_WIDTH_ESTIMATE = 240;
const MENU_HEIGHT_ESTIMATE = 300;

interface UseContextMenuOptions {
  /** Menu items to show when triggered */
  items: MenuItem[];
  /** Optional callback to get items dynamically based on context */
  getItems?: (element: HTMLElement) => MenuItem[];
}

/**
 * Hook that attaches context menu behavior to any element.
 * Handles right-click, long-press on touch, and keyboard triggers.
 */
export function useContextMenu(options: UseContextMenuOptions): UseContextMenuReturn {
  const { items, getItems } = options;
  const ref = useRef<HTMLElement>(null);
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressPositionRef = useRef<{ x: number; y: number } | null>(null);

  const handleContextMenu = useCallback(
    (e: React.MouseEvent | MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const element = ref.current;
      if (!element) return;

      const resolvedItems = getItems ? getItems(element) : items;

      const position = calculateMenuPosition(e.clientX, e.clientY, {
        menuWidth: MENU_WIDTH_ESTIMATE,
        menuHeight: MENU_HEIGHT_ESTIMATE,
        margin: 8,
      });

      useContextMenuStore.getState().openMenu(
        resolvedItems,
        position,
        element,
        'mouse'
      );
    },
    [items, getItems]
  );

  const handleTouchStart = useCallback(
    (e: React.TouchEvent | TouchEvent) => {
      const touch = e.touches[0];
      if (!touch) return;

      longPressPositionRef.current = { x: touch.clientX, y: touch.clientY };

      longPressTimerRef.current = setTimeout(() => {
        const element = ref.current;
        if (!element || !longPressPositionRef.current) return;

        e.preventDefault();

        const resolvedItems = getItems ? getItems(element) : items;
        const { x, y } = longPressPositionRef.current;

        const position = calculateMenuPosition(x, y, {
          menuWidth: MENU_WIDTH_ESTIMATE,
          menuHeight: MENU_HEIGHT_ESTIMATE,
          margin: 8,
        });

        useContextMenuStore.getState().openMenu(
          resolvedItems,
          position,
          element,
          'touch'
        );
      }, LONG_PRESS_DURATION);
    },
    [items, getItems]
  );

  const handleTouchEnd = useCallback(() => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    longPressPositionRef.current = null;
  }, []);

  const handleTouchMove = useCallback(() => {
    // Cancel long-press if the user moves their finger
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    longPressPositionRef.current = null;
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent | KeyboardEvent) => {
      // Menu key (code: "ContextMenu") or Shift+F10
      if (e.code === 'ContextMenu' || (e.key === 'F10' && e.shiftKey)) {
        e.preventDefault();

        const element = ref.current;
        if (!element) return;

        const resolvedItems = getItems ? getItems(element) : items;

        // For keyboard triggers, position at the element's bounding rect
        const rect = element.getBoundingClientRect();
        const position = calculateMenuPosition(rect.left, rect.bottom, {
          menuWidth: MENU_WIDTH_ESTIMATE,
          menuHeight: MENU_HEIGHT_ESTIMATE,
          margin: 4,
        });

        useContextMenuStore.getState().openMenu(
          resolvedItems,
          position,
          element,
          'keyboard'
        );
      }
    },
    [items, getItems]
  );

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    element.addEventListener('contextmenu', handleContextMenu as EventListener);
    element.addEventListener('touchstart', handleTouchStart as EventListener, {
      passive: false,
    });
    element.addEventListener('touchend', handleTouchEnd as EventListener);
    element.addEventListener('touchmove', handleTouchMove as EventListener);
    element.addEventListener('keydown', handleKeyDown as EventListener);

    return () => {
      element.removeEventListener('contextmenu', handleContextMenu as EventListener);
      element.removeEventListener('touchstart', handleTouchStart as EventListener);
      element.removeEventListener('touchend', handleTouchEnd as EventListener);
      element.removeEventListener('touchmove', handleTouchMove as EventListener);
      element.removeEventListener('keydown', handleKeyDown as EventListener);

      // Clean up any pending long-press timer
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
      }
    };
  }, [handleContextMenu, handleTouchStart, handleTouchEnd, handleTouchMove, handleKeyDown]);

  return { ref };
}
