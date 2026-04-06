// Core types for the drag-and-drop list system

export type DragStatus = 'idle' | 'grabbed' | 'dragging' | 'dropped';
export type DropPosition = 'before' | 'after';
export type DragSource = 'pointer' | 'keyboard' | 'html5';

export interface DraggableItem<T = unknown> {
  id: string;
  data: T;
  disabled?: boolean;
  groupId?: string; // For nested lists
  columnId?: string; // For multi-column (Kanban)
}

export interface DropTarget {
  itemId: string;
  position: DropPosition;
  columnId?: string;
  groupId?: string;
}

export interface DragState {
  activeItem: DraggableItem;
  originX: number;
  originY: number;
  pointerX: number;
  pointerY: number;
  isDragging: boolean;
  source: DragSource;
  sourceIndex: number;
  sourceColumnId?: string;
}

export interface DragConfig {
  longPressDelay: number; // ms, default 300
  movementThreshold: number; // px, default 5
  animationDuration: number; // ms, default 250
  ghostOffsetY: number; // px, default 10
  autoScrollThreshold: number; // px, default 50
  autoScrollSpeed: number; // px/frame, default 5
  maxHistoryDepth: number; // default 10
  apiDebounceMs: number; // ms, default 300
}

export const DEFAULT_DRAG_CONFIG: DragConfig = {
  longPressDelay: 300,
  movementThreshold: 5,
  animationDuration: 250,
  ghostOffsetY: 10,
  autoScrollThreshold: 50,
  autoScrollSpeed: 5,
  maxHistoryDepth: 10,
  apiDebounceMs: 300,
};

export interface ReorderPayload {
  sourceIndex: number;
  targetIndex: number;
  sourceColumnId?: string;
  targetColumnId?: string;
  sourceGroupId?: string;
  targetGroupId?: string;
  itemId: string;
}

export interface ReorderHistoryEntry<T = unknown> {
  items: DraggableItem<T>[];
  timestamp: number;
}

export interface BoundingBox {
  id: string;
  top: number;
  bottom: number;
  left: number;
  right: number;
  height: number;
  width: number;
}
