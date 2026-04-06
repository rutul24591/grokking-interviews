import type { MenuItem } from './context-menu-types';
import { useContextMenuStore } from './context-menu-store';
import { openSubMenu, closeSubMenu } from './submenu-manager';

/**
 * Processes keyboard events within the context menu.
 * Returns an action string describing what happened, or null if no action was taken.
 */
export function handleMenuKeyDown(
  e: React.KeyboardEvent,
  items: MenuItem[]
): string | null {
  const state = useContextMenuStore.getState();
  const { focusedIndex } = state;

  switch (e.key) {
    case 'ArrowDown': {
      e.preventDefault();
      const nextIndex = findNextFocusable(items, focusedIndex, 1);
      if (nextIndex !== -1) {
        useContextMenuStore.getState().setFocusedIndex(nextIndex);
      }
      return 'focus-changed';
    }

    case 'ArrowUp': {
      e.preventDefault();
      const nextIndex = findNextFocusable(items, focusedIndex, -1);
      if (nextIndex !== -1) {
        useContextMenuStore.getState().setFocusedIndex(nextIndex);
      }
      return 'focus-changed';
    }

    case 'Enter':
    case ' ': {
      e.preventDefault();
      activateItem(items, focusedIndex);
      return 'activated';
    }

    case 'Escape': {
      e.preventDefault();
      if (state.subMenuStack.length > 0) {
        closeSubMenu();
        return 'submenu-closed';
      }
      useContextMenuStore.getState().closeMenu();
      return 'menu-closed';
    }

    case 'Home': {
      e.preventDefault();
      const firstIndex = findFirstFocusable(items);
      if (firstIndex !== -1) {
        useContextMenuStore.getState().setFocusedIndex(firstIndex);
      }
      return 'focus-changed';
    }

    case 'End': {
      e.preventDefault();
      const lastIndex = findLastFocusable(items);
      if (lastIndex !== -1) {
        useContextMenuStore.getState().setFocusedIndex(lastIndex);
      }
      return 'focus-changed';
    }

    case 'ArrowRight': {
      e.preventDefault();
      const item = items[focusedIndex];
      if (item && item.type === 'submenu') {
        // Get the bounding rect of the focused DOM element
        const focusedElement = document.querySelector('[data-focused-menu-item="true"]');
        if (focusedElement) {
          const rect = focusedElement.getBoundingClientRect();
          openSubMenu(focusedIndex, rect);
          return 'submenu-opened';
        }
      }
      return null;
    }

    case 'ArrowLeft': {
      e.preventDefault();
      if (state.subMenuStack.length > 0) {
        closeSubMenu();
        return 'submenu-closed';
      }
      return null;
    }

    default:
      return null;
  }
}

/**
 * Finds the next focusable item index in the given direction.
 * Wraps around if no item is found in the direction.
 */
function findNextFocusable(
  items: MenuItem[],
  currentIndex: number,
  direction: 1 | -1
): number {
  const len = items.length;
  if (len === 0) return -1;

  let idx = (currentIndex + direction + len) % len;
  const startIdx = idx;

  do {
    const item = items[idx];
    if (item.type !== 'separator' && !(item.type === 'item' && item.disabled)) {
      return idx;
    }
    idx = (idx + direction + len) % len;
  } while (idx !== startIdx);

  return -1;
}

function findFirstFocusable(items: MenuItem[]): number {
  for (let i = 0; i < items.length; i++) {
    if (items[i].type !== 'separator' && !(items[i].type === 'item' && items[i].disabled)) {
      return i;
    }
  }
  return -1;
}

function findLastFocusable(items: MenuItem[]): number {
  for (let i = items.length - 1; i >= 0; i--) {
    if (items[i].type !== 'separator' && !(items[i].type === 'item' && items[i].disabled)) {
      return i;
    }
  }
  return -1;
}

/**
 * Activates the item at the given index — calls onSelect if it exists.
 */
function activateItem(items: MenuItem[], index: number): void {
  const item = items[index];
  if (!item) return;
  if (item.type === 'separator') return;
  if (item.type === 'item' && item.disabled) return;

  if (item.type === 'item' && item.onSelect) {
    item.onSelect();
  }

  // Close the menu after activation (unless it's a sub-menu trigger)
  if (item.type !== 'submenu') {
    useContextMenuStore.getState().closeMenu();
  }
}
