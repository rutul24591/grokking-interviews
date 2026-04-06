import { useCallback, useEffect, useRef, useState } from 'react';
import type { DraggableItem, DragStatus } from '../lib/drag-drop-types';
import { PointerDragHandler } from '../lib/pointer-drag-handler';

interface UseDraggableOptions<T = unknown> {
  item: DraggableItem<T>;
  index: number;
  columnId?: string;
  totalItems: number;
  onDragStart: (state: {
    item: DraggableItem;
    sourceIndex: number;
    sourceColumnId?: string;
    originX: number;
    originY: number;
    pointerX: number;
    pointerY: number;
  }) => void;
  onDragEnd: () => void;
  onMoveItem: (direction: 'up' | 'down') => void;
  announceToScreenReader: (message: string) => void;
}

interface UseDraggableReturn {
  props: {
    ref: (el: HTMLElement | null) => void;
    tabIndex: number;
    role: string;
    'aria-grabbed': boolean;
    'aria-posinset': number;
    'aria-setsize': number;
    'aria-label': string;
    'data-item-id': string;
    onKeyDown: (e: React.KeyboardEvent) => void;
  };
  status: DragStatus;
}

export function useDraggable<T = unknown>(
  options: UseDraggableOptions<T>
): UseDraggableReturn {
  const { item, index, totalItems, columnId } = options;
  const [status, setStatus] = useState<DragStatus>('idle');
  const elementRef = useRef<HTMLElement | null>(null);
  const handlerRef = useRef<ReturnType<typeof PointerDragHandler.create> | null>(null);
  const isKeyboardDragging = useRef(false);

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
      setStatus('dragging');
      options.announceToScreenReader(
        `Item picked, position ${state.sourceIndex + 1} of ${totalItems}`
      );
      options.onDragStart(state);
    },
    [totalItems, options]
  );

  const handleDragEnd = useCallback(() => {
    setStatus('dropped');
    options.onDragEnd();
    // Reset to idle after a brief delay for visual feedback
    setTimeout(() => setStatus('idle'), 200);
  }, [options]);

  const handleDragCancel = useCallback(() => {
    setStatus('idle');
    options.onDragEnd();
  }, [options]);

  // Set up pointer drag handler
  useEffect(() => {
    if (!elementRef.current || item.disabled) return;

    // Clean up previous handler
    if (handlerRef.current) {
      handlerRef.current.cleanup();
    }

    handlerRef.current = PointerDragHandler.create({
      item,
      sourceIndex: index,
      sourceColumnId: columnId,
      onDragStart: (state) =>
        handleDragStart({
          item: state.activeItem,
          sourceIndex: state.sourceIndex,
          sourceColumnId: state.sourceColumnId,
          originX: state.originX,
          originY: state.originY,
          pointerX: state.pointerX,
          pointerY: state.pointerY,
        }),
      onDragMove: () => {},
      onDragEnd: handleDragEnd,
      onDragCancel: handleDragCancel,
    });

    const el = elementRef.current;
    el.addEventListener('pointerdown', handlerRef.current.onPointerDown);

    return () => {
      el.removeEventListener('pointerdown', handlerRef.current!.onPointerDown);
      handlerRef.current!.cleanup();
    };
  }, [item.id, item.disabled, index, columnId, handleDragStart, handleDragEnd, handleDragCancel]);

  // Keyboard handling
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (item.disabled) return;

      switch (e.key) {
        case ' ':
        case 'Enter': {
          if (status === 'idle') {
            e.preventDefault();
            isKeyboardDragging.current = true;
            setStatus('grabbed');
            options.announceToScreenReader(
              `Item picked, position ${index + 1} of ${totalItems}. Use arrow keys to move, Enter to drop, Escape to cancel.`
            );
          } else if (status === 'grabbed' || status === 'dragging') {
            e.preventDefault();
            isKeyboardDragging.current = false;
            setStatus('dropped');
            options.announceToScreenReader(
              `Item dropped at position ${index + 1}.`
            );
            options.onDragEnd();
            setTimeout(() => setStatus('idle'), 200);
          }
          break;
        }
        case 'ArrowUp': {
          if (status === 'grabbed' || status === 'dragging') {
            e.preventDefault();
            options.onMoveItem('up');
            options.announceToScreenReader(
              `Moved to position ${index}`
            );
            setStatus('dragging');
          }
          break;
        }
        case 'ArrowDown': {
          if (status === 'grabbed' || status === 'dragging') {
            e.preventDefault();
            options.onMoveItem('down');
            options.announceToScreenReader(
              `Moved to position ${index + 2}`
            );
            setStatus('dragging');
          }
          break;
        }
        case 'Escape': {
          if (status !== 'idle') {
            e.preventDefault();
            isKeyboardDragging.current = false;
            setStatus('idle');
            options.announceToScreenReader('Drag cancelled.');
            options.onDragEnd();
          }
          break;
        }
      }
    },
    [status, index, totalItems, item.disabled, options]
  );

  // Ref callback
  const setRef = useCallback((el: HTMLElement | null) => {
    elementRef.current = el;
  }, []);

  const isGrabbed = status === 'grabbed' || status === 'dragging';

  return {
    props: {
      ref: setRef,
      tabIndex: 0,
      role: 'listitem',
      'aria-grabbed': isGrabbed,
      'aria-posinset': index + 1,
      'aria-setsize': totalItems,
      'aria-label': `${item.id}, position ${index + 1} of ${totalItems}${isGrabbed ? ', grabbed' : ''}`,
      'data-item-id': item.id,
      onKeyDown: handleKeyDown,
    },
    status,
  };
}
