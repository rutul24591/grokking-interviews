/**
 * Keyboard Drag — Full keyboard accessibility for drag-and-drop reordering.
 *
 * Interview edge case: Keyboard-only users need to reorder items via drag-and-drop.
 * Standard drag (mouse) doesn't work with keyboard. Solution: Space to pick up,
 * Arrow keys to move, Enter to drop, Escape to cancel.
 */

import { useState, useCallback, useRef } from 'react';

interface KeyboardDragState {
  draggedItemId: string | null;
  draggedItemIndex: number | null;
  dropTargetIndex: number | null;
}

/**
 * Hook that implements keyboard-based drag-and-drop reordering.
 */
export function useKeyboardDrag<T>(
  items: T[],
  onReorder: (fromIndex: number, toIndex: number) => void,
) {
  const [state, setState] = useState<KeyboardDragState>({
    draggedItemId: null,
    draggedItemIndex: null,
    dropTargetIndex: null,
  });
  const focusedIndexRef = useRef<number>(0);

  /**
   * Called when user focuses an item.
   */
  const onFocusItem = useCallback((index: number) => {
    focusedIndexRef.current = index;
  }, []);

  /**
   * Called on keydown for the focused item.
   */
  const onKeyDown = useCallback((e: React.KeyboardEvent, index: number) => {
    switch (e.key) {
      case ' ':
      case 'Enter':
        e.preventDefault();
        if (!state.draggedItemId) {
          // Pick up the item
          setState({
            draggedItemId: String(index),
            draggedItemIndex: index,
            dropTargetIndex: index,
          });
        } else {
          // Drop the item
          if (state.draggedItemIndex !== null && state.dropTargetIndex !== null) {
            onReorder(state.draggedItemIndex, state.dropTargetIndex);
          }
          setState({ draggedItemId: null, draggedItemIndex: null, dropTargetIndex: null });
        }
        break;

      case 'ArrowUp':
        e.preventDefault();
        if (state.draggedItemId && state.dropTargetIndex !== null && state.dropTargetIndex > 0) {
          setState((prev) => ({
            ...prev,
            dropTargetIndex: prev.dropTargetIndex! - 1,
          }));
        }
        break;

      case 'ArrowDown':
        e.preventDefault();
        if (state.draggedItemId && state.dropTargetIndex !== null && state.dropTargetIndex < items.length - 1) {
          setState((prev) => ({
            ...prev,
            dropTargetIndex: prev.dropTargetIndex! + 1,
          }));
        }
        break;

      case 'Escape':
        e.preventDefault();
        setState({ draggedItemId: null, draggedItemIndex: null, dropTargetIndex: null });
        break;
    }
  }, [state, items.length, onReorder]);

  /**
   * Returns whether an item is the dragged item or the drop target.
   */
  const getItemState = (index: number): 'normal' | 'dragging' | 'drop-target' => {
    if (state.draggedItemIndex === index) return 'dragging';
    if (state.dropTargetIndex === index && state.draggedItemId !== null) return 'drop-target';
    return 'normal';
  };

  return { onFocusItem, onKeyDown, getItemState, isDragging: state.draggedItemId !== null };
}
