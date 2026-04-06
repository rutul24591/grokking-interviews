import { useCallback, useEffect, useRef, useState } from 'react';
import type {
  DraggableItem,
  DropTarget,
  ReorderPayload,
  DragConfig,
} from '../lib/drag-drop-types';
import { DEFAULT_DRAG_CONFIG } from '../lib/drag-drop-types';
import { FlipAnimator } from '../lib/flip-animator';

interface UseSortableListOptions<T = unknown> {
  items: DraggableItem<T>[];
  columnId?: string;
  config?: Partial<DragConfig>;
  onReorder: (payload: ReorderPayload) => Promise<void>;
  onError: (error: Error) => void;
}

interface UseSortableListReturn<T = unknown> {
  items: DraggableItem<T>[];
  handleDrop: (dropTarget: DropTarget, sourceIndex: number, sourceColumnId?: string) => void;
  handleMoveItem: (index: number, direction: 'up' | 'down') => void;
  isPending: boolean;
  error: Error | null;
}

/**
 * Main hook coordinating the sortable list.
 *
 * Manages local item array, handles drop events, triggers FLIP animations,
 * and handles API persistence with optimistic updates and rollback.
 */
export function useSortableList<T = unknown>(
  options: UseSortableListOptions<T>
): UseSortableListReturn<T> {
  const { items: initialItems, columnId, onReorder, onError } = options;
  const config = { ...DEFAULT_DRAG_CONFIG, ...options.config };

  const [items, setItems] = useState<DraggableItem<T>[]>(initialItems);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const animatorRef = useRef(new FlipAnimator(config));
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingReorderRef = useRef<{
    payload: ReorderPayload;
    previousItems: DraggableItem<T>[];
  } | null>(null);

  // Update items when initialItems change (e.g., from API refetch)
  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  /**
   * Commits a reorder: saves history, applies new order, triggers FLIP, fires API.
   */
  const commitReorder = useCallback(
    (
      newItems: DraggableItem<T>[],
      payload: ReorderPayload,
      previousItems: DraggableItem<T>[]
    ) => {
      // Capture FLIP First positions before DOM update
      const itemElements = document.querySelectorAll<HTMLElement>('[data-item-id]');
      animatorRef.current.captureFirst(Array.from(itemElements));

      // Apply new order
      setItems(newItems);

      // After React re-renders, apply FLIP animation
      requestAnimationFrame(() => {
        animatorRef.current.applyFlip();
      });

      // Debounce API call
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      pendingReorderRef.current = { payload, previousItems };
      setIsPending(true);

      debounceTimerRef.current = setTimeout(async () => {
        try {
          await onReorder(payload);
          setIsPending(false);
          pendingReorderRef.current = null;
        } catch (err) {
          // Rollback on API failure
          const previous = pendingReorderRef.current?.previousItems;
          if (previous) {
            setItems(previous);
            // Trigger reverse FLIP
            const itemElements = document.querySelectorAll<HTMLElement>('[data-item-id]');
            animatorRef.current.captureFirst(Array.from(itemElements));
            requestAnimationFrame(() => {
              animatorRef.current.applyFlip();
            });
          }
          const error = err instanceof Error ? err : new Error('Reorder failed');
          setError(error);
          onError(error);
          setIsPending(false);
          pendingReorderRef.current = null;
        }
      }, config.apiDebounceMs);
    },
    [onReorder, onError, config.apiDebounceMs]
  );

  /**
   * Handles drop: computes new order, commits reorder.
   */
  const handleDrop = useCallback(
    (dropTarget: DropTarget, sourceIndex: number, sourceColumnId?: string) => {
      const targetIndex = computeTargetIndex(items, dropTarget);

      // No-op: dropping on same position
      if (targetIndex === sourceIndex && sourceColumnId === dropTarget.columnId) {
        return;
      }

      // Prevent circular nesting (simplified check — real implementation
      // would traverse ancestry)
      if (wouldCreateCircularNesting(items[sourceIndex], dropTarget)) {
        return;
      }

      // Compute new order
      const newItems = computeNewOrder(items, sourceIndex, targetIndex);
      const previousItems = [...items];

      // Build API payload
      const payload: ReorderPayload = {
        sourceIndex,
        targetIndex,
        sourceColumnId,
        targetColumnId: dropTarget.columnId,
        sourceGroupId: items[sourceIndex].groupId,
        targetGroupId: dropTarget.groupId,
        itemId: items[sourceIndex].id,
      };

      commitReorder(newItems, payload, previousItems);
    },
    [items, commitReorder]
  );

  /**
   * Handles keyboard-driven item movement (one step up or down).
   */
  const handleMoveItem = useCallback(
    (index: number, direction: 'up' | 'down') => {
      const targetIndex = direction === 'up' ? index - 1 : index + 1;

      // Bounds check
      if (targetIndex < 0 || targetIndex >= items.length) return;

      const newItems = [...items];
      const [movedItem] = newItems.splice(index, 1);
      newItems.splice(targetIndex, 0, movedItem);

      setItems(newItems);

      // Capture + FLIP for keyboard moves too
      const itemElements = document.querySelectorAll<HTMLElement>('[data-item-id]');
      animatorRef.current.captureFirst(Array.from(itemElements));
      requestAnimationFrame(() => {
        animatorRef.current.applyFlip();
      });
    },
    [items]
  );

  return {
    items,
    handleDrop,
    handleMoveItem,
    isPending,
    error,
  };
}

/**
 * Computes the target index from a DropTarget.
 */
function computeTargetIndex<T>(
  items: DraggableItem<T>[],
  dropTarget: DropTarget
): number {
  const targetItemIndex = items.findIndex((item) => item.id === dropTarget.itemId);
  if (targetItemIndex === -1) return 0;

  return dropTarget.position === 'before' ? targetItemIndex : targetItemIndex + 1;
}

/**
 * Computes new item order after moving an item from sourceIndex to targetIndex.
 */
function computeNewOrder<T>(
  items: DraggableItem<T>[],
  sourceIndex: number,
  targetIndex: number
): DraggableItem<T>[] {
  const newItems = [...items];
  const [movedItem] = newItems.splice(sourceIndex, 1);
  newItems.splice(targetIndex, 0, movedItem);
  return newItems;
}

/**
 * Checks if dropping an item into a target would create circular nesting.
 * Simplified implementation — real version would traverse the ancestry chain.
 */
function wouldCreateCircularNesting<T>(
  draggedItem: DraggableItem<T>,
  _dropTarget: DropTarget
): boolean {
  // In a real implementation, traverse the parent chain of the target group
  // and check if the dragged item is an ancestor.
  // For now, we check if the item's groupId matches the target's groupId
  // (which would mean dropping into the same group — allowed)
  // or if the target is a child of the dragged item (forbidden).
  if (!draggedItem.groupId || !_dropTarget.groupId) return false;

  // Simplified: check if target groupId starts with dragged item's groupId
  // (indicating a descendant relationship)
  return _dropTarget.groupId.startsWith(`${draggedItem.groupId}.`);
}
