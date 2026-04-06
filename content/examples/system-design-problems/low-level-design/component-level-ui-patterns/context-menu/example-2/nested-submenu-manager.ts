/**
 * Nested Sub-menu Manager — Stack-based sub-menu with max depth enforcement.
 *
 * Interview edge case: User hovers on a sub-menu item that has its own sub-menu.
 * That sub-menu has another sub-menu. Without depth limits, menus can nest infinitely.
 * Solution: stack-based manager with max depth 3, ArrowLeft closes current level.
 */

export interface SubMenuEntry {
  id: string;
  parentId: string | null;
  label: string;
  hasChildren: boolean;
}

/**
 * Manages a stack of nested sub-menus.
 */
export class SubMenuManager {
  private stack: SubMenuEntry[] = [];
  private readonly maxDepth: number;

  constructor(maxDepth: number = 3) {
    this.maxDepth = maxDepth;
  }

  /**
   * Opens a sub-menu. Returns false if max depth reached.
   */
  openSubMenu(entry: SubMenuEntry): boolean {
    if (this.stack.length >= this.maxDepth) {
      return false;
    }
    this.stack.push(entry);
    return true;
  }

  /**
   * Closes the current (topmost) sub-menu.
   */
  closeCurrent(): SubMenuEntry | null {
    return this.stack.length > 0 ? this.stack.pop()! : null;
  }

  /**
   * Closes all sub-menus back to the root.
   */
  closeAll(): SubMenuEntry[] {
    const closed = [...this.stack];
    this.stack = [];
    return closed;
  }

  /**
   * Returns the current depth level (0 = root menu).
   */
  getDepth(): number {
    return this.stack.length;
  }

  /**
   * Returns the currently open sub-menu (topmost).
   */
  getCurrent(): SubMenuEntry | null {
    return this.stack.length > 0 ? this.stack[this.stack.length - 1] : null;
  }

  /**
   * Returns all items at the current level for keyboard navigation.
   */
  getItemsAtCurrentLevel(items: SubMenuEntry[]): SubMenuEntry[] {
    if (this.stack.length === 0) return items;
    const parentId = this.stack[this.stack.length - 1].id;
    return items.filter((item) => item.parentId === parentId);
  }
}
