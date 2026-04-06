import { create } from 'zustand';
import type {
  DraggableItem,
  DragState,
  DropTarget,
  ReorderHistoryEntry,
  ReorderPayload,
} from './drag-drop-types';

interface PendingRequest {
  controller: AbortController;
  payload: ReorderPayload;
}

interface DragDropState<T = unknown> {
  activeDrag: DragState | null;
  dropTarget: DropTarget | null;
  history: ReorderHistoryEntry<T>[];
  pendingRequests: Map<string, PendingRequest>;

  // Actions
  startDrag: (state: Omit<DragState, 'isDragging'>) => void;
  updatePointer: (x: number, y: number) => void;
  setDropTarget: (target: DropTarget | null) => void;
  endDrag: () => void;
  pushHistory: (items: DraggableItem<T>[]) => void;
  commitReorder: () => void;
  rollbackReorder: () => ReorderHistoryEntry<T> | null;
  cancelPendingRequest: (key: string) => void;
  reset: () => void;
}

export function createDragDropStore<T = unknown>() {
  return create<DragDropState<T>>((set, get) => ({
    activeDrag: null,
    dropTarget: null,
    history: [],
    pendingRequests: new Map(),

    startDrag: (dragState) => {
      set({
        activeDrag: { ...dragState, isDragging: true },
        dropTarget: null,
      });
    },

    updatePointer: (x, y) => {
      set((state) => {
        if (!state.activeDrag) return state;
        return {
          activeDrag: { ...state.activeDrag, pointerX: x, pointerY: y },
        };
      });
    },

    setDropTarget: (target) => {
      set({ dropTarget: target });
    },

    endDrag: () => {
      set({
        activeDrag: null,
        dropTarget: null,
      });
    },

    pushHistory: (items) => {
      set((state) => {
        const entry: ReorderHistoryEntry<T> = {
          items: [...items],
          timestamp: Date.now(),
        };
        const newHistory = [...state.history, entry];
        // Cap history depth
        if (newHistory.length > 10) {
          newHistory.shift();
        }
        return { history: newHistory };
      });
    },

    commitReorder: () => {
      // Clear history on successful commit (we no longer need rollback)
      set({ history: [] });
    },

    rollbackReorder: () => {
      const { history } = get();
      if (history.length === 0) return null;

      const lastEntry = history[history.length - 1];
      set({
        history: history.slice(0, -1),
      });
      return lastEntry;
    },

    cancelPendingRequest: (key) => {
      set((state) => {
        const request = state.pendingRequests.get(key);
        if (request) {
          request.controller.abort();
        }
        const newMap = new Map(state.pendingRequests);
        newMap.delete(key);
        return { pendingRequests: newMap };
      });
    },

    reset: () => {
      // Abort all pending requests
      get().pendingRequests.forEach((request) => {
        request.controller.abort();
      });
      set({
        activeDrag: null,
        dropTarget: null,
        history: [],
        pendingRequests: new Map(),
      });
    },
  }));
}

// Default store instance for single-list scenarios
export const useDragDropStore = createDragDropStore();
