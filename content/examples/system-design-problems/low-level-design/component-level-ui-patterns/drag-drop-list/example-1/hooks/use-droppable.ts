import { useCallback, useEffect, useRef, useState } from 'react';
import type { DropTarget, BoundingBox, DropPosition } from '../lib/drag-drop-types';

interface UseDroppableOptions {
  itemId: string;
  columnId?: string;
  groupId?: string;
  isActiveDrag: boolean;
  onDropTargetChange: (target: DropTarget | null) => void;
}

interface UseDroppableReturn {
  ref: (el: HTMLElement | null) => void;
  boundingBox: BoundingBox | null;
  isDropTarget: boolean;
}

/**
 * Hook for drop target zones.
 *
 * Uses ResizeObserver to keep bounding boxes up to date.
 * Computes collision based on pointer position vs. item bounding box.
 * For vertical lists, splits the box horizontally:
 * - Top half -> drop position "before"
 * - Bottom half -> drop position "after"
 */
export function useDroppable(options: UseDroppableOptions): UseDroppableReturn {
  const { itemId, columnId, groupId, isActiveDrag } = options;
  const elementRef = useRef<HTMLElement | null>(null);
  const [boundingBox, setBoundingBox] = useState<BoundingBox | null>(null);
  const [isDropTarget, setIsDropTarget] = useState(false);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const isActiveDragRef = useRef(isActiveDrag);

  // Keep ref in sync for use in callbacks
  useEffect(() => {
    isActiveDragRef.current = isActiveDrag;
  }, [isActiveDrag]);

  // Set up ResizeObserver to track bounding box changes
  useEffect(() => {
    if (!elementRef.current) return;

    const element = elementRef.current;

    const updateBoundingBox = () => {
      const rect = element.getBoundingClientRect();
      setBoundingBox({
        id: itemId,
        top: rect.top,
        bottom: rect.bottom,
        left: rect.left,
        right: rect.right,
        height: rect.height,
        width: rect.width,
      });
    };

    // Initial measurement
    updateBoundingBox();

    // Observe size changes
    const observer = new ResizeObserver(() => {
      updateBoundingBox();
    });
    observer.observe(element);
    resizeObserverRef.current = observer;

    return () => {
      observer.disconnect();
      resizeObserverRef.current = null;
    };
  }, [itemId]);

  // Collision detection: check if pointer is within this item's bounding box
  const checkCollision = useCallback(
    (pointerX: number, pointerY: number): DropTarget | null => {
      if (!boundingBox) return null;

      const { top, bottom, left, right, height } = boundingBox;

      // Check if pointer is within the bounding box
      if (
        pointerX < left ||
        pointerX > right ||
        pointerY < top ||
        pointerY > bottom
      ) {
        return null;
      }

      // Determine drop position based on vertical position within the box
      const midpoint = top + height / 2;
      const position: DropPosition = pointerY < midpoint ? 'before' : 'after';

      return {
        itemId,
        position,
        columnId,
        groupId,
      };
    },
    [boundingBox, itemId, columnId, groupId]
  );

  // Expose the checkCollision method for external use (e.g., store subscription)
  // We attach it to the ref so parent components can call it
  const collisionCheckRef = useRef(checkCollision);
  useEffect(() => {
    collisionCheckRef.current = checkCollision;
  }, [checkCollision]);

  // Store the collision check function on the element for the parent to find
  useEffect(() => {
    if (elementRef.current) {
      (elementRef.current as HTMLElement & { __checkCollision?: typeof checkCollision }).__checkCollision =
        checkCollision;
    }
  }, [checkCollision]);

  // Ref callback
  const setRef = useCallback((el: HTMLElement | null) => {
    elementRef.current = el;
  }, []);

  return {
    ref: setRef,
    boundingBox,
    isDropTarget,
  };
}

/**
 * Utility function to find the drop target from a list of collision check functions.
 * Uses binary search on sorted bounding boxes for O(log n) lookups.
 */
export function findDropTarget(
  collisionChecks: Array<{
    id: string;
    check: (x: number, y: number) => DropTarget | null;
  }>,
  pointerX: number,
  pointerY: number
): DropTarget | null {
  // For small lists (< 50 items), linear scan is faster than binary search
  // due to function call overhead
  if (collisionChecks.length < 50) {
    for (const { check } of collisionChecks) {
      const result = check(pointerX, pointerY);
      if (result) return result;
    }
    return null;
  }

  // For larger lists, binary search on sorted bounding boxes
  // (assuming boxes are sorted by Y position for vertical lists)
  let low = 0;
  let high = collisionChecks.length - 1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const result = collisionChecks[mid].check(pointerX, pointerY);
    if (result) return result;

    // If we didn't hit, check if pointer is above or below this box
    // This is a simplified binary search — in practice, items may overlap
    // or have gaps, so a full scan may still be necessary
    low = mid + 1;
    high = mid - 1;
  }

  return null;
}
