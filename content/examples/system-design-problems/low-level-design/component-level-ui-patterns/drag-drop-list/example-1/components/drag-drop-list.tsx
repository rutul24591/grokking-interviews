import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type {
  DraggableItem,
  DropTarget,
  DragState,
  DragConfig,
  ReorderPayload,
} from '../../lib/drag-drop-types';
import { DEFAULT_DRAG_CONFIG } from '../../lib/drag-drop-types';
import { useSortableList } from '../../hooks/use-sortable-list';
import { useDragDropStore } from '../../lib/drag-drop-store';

// Re-export for clarity
export { DraggableItemComponent } from './draggable-item';
export { DropIndicator } from './drop-indicator';
export { DragGhost } from './drag-ghost';

interface DragDropContextValue {
  activeDrag: DragState | null;
  dropTarget: DropTarget | null;
  announceToScreenReader: (message: string) => void;
  config: DragConfig;
}

const DragDropContext = createContext<DragDropContextValue | null>(null);

export function useDragDropContext(): DragDropContextValue {
  const context = useContext(DragDropContext);
  if (!context) {
    throw new Error('useDragDropContext must be used within a DragDropListContainer');
  }
  return context;
}

interface DragDropListContainerProps<T = unknown> {
  items: DraggableItem<T>[];
  columnId?: string;
  config?: Partial<DragConfig>;
  onReorder: (payload: ReorderPayload) => Promise<void>;
  children: (props: {
    items: DraggableItem<T>[];
    context: DragDropContextValue;
  }) => React.ReactNode;
}

/**
 * Root container for a drag-drop list.
 *
 * Provides context, manages drag state via Zustand store,
 * and orchestrates the sortable list with optimistic updates.
 */
export function DragDropListContainer<T = unknown>({
  items,
  columnId,
  config: userConfig,
  onReorder,
  children,
}: DragDropListContainerProps<T>) {
  const config = useMemo(
    () => ({ ...DEFAULT_DRAG_CONFIG, ...userConfig }),
    [userConfig]
  );

  const store = useDragDropStore();
  const { activeDrag, dropTarget } = store();
  const [liveMessage, setLiveMessage] = useState('');

  const announceToScreenReader = useCallback((message: string) => {
    setLiveMessage(message);
    // Clear after announcement is picked up by screen readers
    setTimeout(() => setLiveMessage(''), 1000);
  }, []);

  const handleError = useCallback(
    (error: Error) => {
      announceToScreenReader(`Error: ${error.message}`);
    },
    [announceToScreenReader]
  );

  const {
    items: listItems,
    handleDrop,
    handleMoveItem,
    isPending,
    error,
  } = useSortableList<T>({
    items,
    columnId,
    config,
    onReorder,
    onError: handleError,
  });

  // Expose drop handler to children via context
  const handleDropRef = useRef(handleDrop);
  useEffect(() => {
    handleDropRef.current = handleDrop;
  }, [handleDrop]);

  const contextValue = useMemo<DragDropContextValue>(
    () => ({
      activeDrag,
      dropTarget,
      announceToScreenReader,
      config,
    }),
    [activeDrag, dropTarget, announceToScreenReader, config]
  );

  return (
    <DragDropContext.Provider value={contextValue}>
      <div
        role="list"
        className="relative flex flex-col gap-2"
        data-column-id={columnId}
      >
        {children({ items: listItems, context: contextValue })}

        {/* Drop indicator rendered via portal in the child components */}
      </div>

      {/* ARIA live region for screen reader announcements */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {liveMessage}
      </div>
    </DragDropContext.Provider>
  );
}

