import type { MenuItem } from './context-menu-types';
import { useContextMenuStore } from './context-menu-store';
import { calculateSubMenuPosition } from './menu-position-calculator';

const SUB_MENU_WIDTH = 220;
const SUB_MENU_HEIGHT = 200; // estimated, will be adjusted by actual rendering

/**
 * Opens a sub-menu when ArrowRight is pressed or on hover.
 * Computes the fly-out position and pushes to the store's sub-menu stack.
 */
export function openSubMenu(parentItemIndex: number, parentItemRect: DOMRect): boolean {
  const state = useContextMenuStore.getState();
  const parentItem = state.items[parentItemIndex];

  if (!parentItem || parentItem.type !== 'submenu') {
    return false;
  }

  const position = calculateSubMenuPosition(
    parentItemRect,
    SUB_MENU_WIDTH,
    SUB_MENU_HEIGHT
  );

  const success = useContextMenuStore.getState().pushSubMenu({
    items: parentItem.children,
    parentIndex: parentItemIndex,
    position,
  });

  if (success) {
    // Focus the first item in the sub-menu
    const firstFocusable = findFirstFocusable(parentItem.children);
    // The sub-menu's own focus management handles this
  }

  return success;
}

/**
 * Closes the top-most sub-menu and returns focus to the parent item.
 */
export function closeSubMenu(): boolean {
  const result = useContextMenuStore.getState().popSubMenu();
  return result !== null;
}

/**
 * Closes all open sub-menus. Called when the main menu closes.
 */
export function closeAllSubMenus() {
  useContextMenuStore.getState().clearSubMenuStack();
}

/**
 * Finds the first focusable item index in a sub-menu's children.
 */
function findFirstFocusable(items: MenuItem[]): number {
  for (let i = 0; i < items.length; i++) {
    if (items[i].type === 'separator') continue;
    if (items[i].type === 'item' && items[i].disabled) continue;
    return i;
  }
  return -1;
}
