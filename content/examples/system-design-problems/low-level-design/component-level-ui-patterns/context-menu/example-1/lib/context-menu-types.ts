import type { ReactNode } from 'react';

export type MenuItemType = 'item' | 'separator' | 'submenu';

export interface MenuPosition {
  x: number;
  y: number;
  flipX: boolean;
  flipY: boolean;
}

export interface BaseMenuItem {
  id: string;
  type: MenuItemType;
}

export interface ActionMenuItem extends BaseMenuItem {
  type: 'item';
  label: string;
  icon?: ReactNode;
  shortcut?: string; // e.g., 'Ctrl+C', 'Cmd+Z'
  disabled?: boolean;
  disabledReason?: string; // tooltip explaining why disabled
  onSelect?: () => void;
}

export interface SeparatorMenuItem extends BaseMenuItem {
  type: 'separator';
}

export interface SubmenuMenuItem extends BaseMenuItem {
  type: 'submenu';
  label: string;
  icon?: ReactNode;
  children: MenuItem[];
}

export type MenuItem = ActionMenuItem | SeparatorMenuItem | SubmenuMenuItem;

export interface SubMenuEntry {
  items: MenuItem[];
  parentIndex: number; // index of the parent item that opened this sub-menu
  position: MenuPosition;
}

export interface ContextMenuState {
  isOpen: boolean;
  position: MenuPosition | null;
  items: MenuItem[];
  focusedIndex: number;
  triggerRef: HTMLElement | null;
  subMenuStack: SubMenuEntry[];
  triggerType: 'mouse' | 'keyboard' | 'touch';
}

export interface UseContextMenuReturn {
  ref: React.RefObject<HTMLElement | null>;
}
