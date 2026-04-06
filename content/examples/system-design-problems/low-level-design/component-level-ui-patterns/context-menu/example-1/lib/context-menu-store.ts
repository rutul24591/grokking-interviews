import { create } from 'zustand';
import type { ContextMenuState, MenuPosition, MenuItem, SubMenuEntry } from './context-menu-types';

const MAX_SUBMENU_DEPTH = 3;

interface ContextMenuStore extends ContextMenuState {
  openMenu: (
    items: MenuItem[],
    position: MenuPosition,
    triggerRef: HTMLElement | null,
    triggerType: 'mouse' | 'keyboard' | 'touch'
  ) => void;
  closeMenu: () => void;
  setFocusedIndex: (index: number) => void;
  pushSubMenu: (entry: SubMenuEntry) => boolean; // returns false if max depth reached
  popSubMenu: () => SubMenuEntry | null;
  clearSubMenuStack: () => void;
}

export const useContextMenuStore = create<ContextMenuStore>((set, get) => ({
  isOpen: false,
  position: null,
  items: [],
  focusedIndex: -1,
  triggerRef: null,
  subMenuStack: [],
  triggerType: 'mouse',

  openMenu: (items, position, triggerRef, triggerType) => {
    // If a menu is already open, close it first (single-menu constraint)
    const current = get();
    if (current.isOpen) {
      restoreFocus(current.triggerRef);
    }

    // Find first non-disabled, non-separator item index
    const firstFocusable = findFirstFocusable(items);

    set({
      isOpen: true,
      position,
      items,
      focusedIndex: firstFocusable,
      triggerRef,
      subMenuStack: [],
      triggerType,
    });
  },

  closeMenu: () => {
    const state = get();
    restoreFocus(state.triggerRef);

    set({
      isOpen: false,
      position: null,
      items: [],
      focusedIndex: -1,
      triggerRef: null,
      subMenuStack: [],
      triggerType: 'mouse',
    });
  },

  setFocusedIndex: (index) => {
    set({ focusedIndex: index });
  },

  pushSubMenu: (entry) => {
    const state = get();
    if (state.subMenuStack.length >= MAX_SUBMENU_DEPTH) {
      return false;
    }

    set((prev) => ({
      subMenuStack: [...prev.subMenuStack, entry],
    }));
    return true;
  },

  popSubMenu: () => {
    const state = get();
    if (state.subMenuStack.length === 0) {
      return null;
    }

    const popped = state.subMenuStack[state.subMenuStack.length - 1];
    set((prev) => ({
      subMenuStack: prev.subMenuStack.slice(0, -1),
      focusedIndex: popped.parentIndex,
    }));
    return popped;
  },

  clearSubMenuStack: () => {
    set({ subMenuStack: [], focusedIndex: -1 });
  },
}));

/**
 * Restore focus to the trigger element if it still exists in the DOM.
 */
function restoreFocus(triggerRef: HTMLElement | null) {
  if (triggerRef && document.body.contains(triggerRef)) {
    triggerRef.focus();
  }
}

/**
 * Find the index of the first focusable menu item (not a separator, not disabled).
 */
function findFirstFocusable(items: MenuItem[]): number {
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (item.type === 'separator') continue;
    if (item.type === 'item' && item.disabled) continue;
    if (item.type === 'submenu') return i;
    return i;
  }
  return -1;
}
