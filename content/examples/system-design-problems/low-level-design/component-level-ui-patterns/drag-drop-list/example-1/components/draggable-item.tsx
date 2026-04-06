import React, { useCallback, useMemo } from 'react';
import type { DraggableItem, DragStatus } from '../../lib/drag-drop-types';
import { useDraggable } from '../../hooks/use-draggable';
import { useDragDropContext } from './drag-drop-list';

interface DraggableItemProps<T = unknown> {
  item: DraggableItem<T>;
  index: number;
  totalItems: number;
  columnId?: string;
  children: React.ReactNode;
  renderDragHandle?: (props: { isDragging: boolean }) => React.ReactNode;
}

/**
 * Individual draggable item component.
 *
 * Uses use-draggable for pointer/keyboard behavior.
 * Renders visual states: default, grabbed placeholder, drop target highlight.
 */
export function DraggableItemComponent<T = unknown>({
  item,
  index,
  totalItems,
  columnId,
  children,
  renderDragHandle,
}: DraggableItemProps<T>) {
  const { activeDrag, dropTarget, announceToScreenReader } = useDragDropContext();

  const handleDragStart = useCallback(
    (state: {
      item: DraggableItem;
      sourceIndex: number;
      sourceColumnId?: string;
      originX: number;
      originY: number;
      pointerX: number;
      pointerY: number;
    }) => {
      // Notify store via context or direct store access
      // This is handled by the parent container
    },
    []
  );

  const handleDragEnd = useCallback(() => {
    // Cleanup after drag ends
  }, []);

  const handleMoveItem = useCallback(
    (direction: 'up' | 'down') => {
      // Handled by parent sortable list
    },
    []
  );

  const { props, status } = useDraggable({
    item,
    index,
    columnId,
    totalItems,
    onDragStart: handleDragStart,
    onDragEnd: handleDragEnd,
    onMoveItem: handleMoveItem,
    announceToScreenReader,
  });

  // Determine visual state
  const isDragging = activeDrag?.activeItem.id === item.id && activeDrag.isDragging;
  const isDropTarget = dropTarget?.itemId === item.id;
  const dropPosition = isDropTarget ? dropTarget?.position : null;

  const className = useMemo(() => {
    const base = 'relative flex items-center gap-3 rounded-lg border px-4 py-3 transition-colors';

    if (isDragging) {
      // Placeholder: same dimensions, dimmed
      return `${base} border-dashed border-accent/30 bg-accent/5 opacity-40`;
    }

    if (item.disabled) {
      return `${base} border-border/50 bg-panel-soft/50 opacity-60 cursor-not-allowed`;
    }

    if (isDropTarget) {
      // Highlight the drop target item
      return `${base} border-accent bg-accent/10 ring-2 ring-accent/50`;
    }

    return `${base} border-border bg-panel hover:border-accent/50 hover:bg-panel-soft cursor-grab active:cursor-grabbing`;
  }, [isDragging, isDropTarget, item.disabled]);

  // Drop position indicator (line before/after this item)
  const dropIndicatorClass =
    dropPosition === 'before'
      ? 'before:absolute before:-top-1 before:left-0 before:right-0 before:h-0.5 before:bg-accent before:rounded-full before:content-[""]'
      : dropPosition === 'after'
        ? 'after:absolute after:-bottom-1 after:left-0 after:right-0 after:h-0.5 after:bg-accent after:rounded-full after:content-[""]'
        : '';

  return (
    <div
      {...props}
      className={`${className} ${dropIndicatorClass}`}
      style={
        isDragging
          ? {
              minHeight: '3rem',
              visibility: 'visible',
            }
          : undefined
      }
    >
      {/* Drag handle */}
      {renderDragHandle ? (
        renderDragHandle({ isDragging })
      ) : (
        <div
          className="flex cursor-grab select-none items-center text-muted"
          aria-label="Drag to reorder"
          role="button"
          tabIndex={-1}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <circle cx="5" cy="3" r="1.5" fill="currentColor" />
            <circle cx="11" cy="3" r="1.5" fill="currentColor" />
            <circle cx="5" cy="8" r="1.5" fill="currentColor" />
            <circle cx="11" cy="8" r="1.5" fill="currentColor" />
            <circle cx="5" cy="13" r="1.5" fill="currentColor" />
            <circle cx="11" cy="13" r="1.5" fill="currentColor" />
          </svg>
        </div>
      )}

      {/* Item content */}
      <div className="flex-1">{children}</div>
    </div>
  );
}
