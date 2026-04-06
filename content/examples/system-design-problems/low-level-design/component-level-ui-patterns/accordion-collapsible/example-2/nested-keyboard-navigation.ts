/**
 * Accordion Nested Keyboard Navigation — Arrow keys navigate between headers, Home/End jump.
 *
 * Interview edge case: Multiple accordions on the same page. ArrowDown on the last
 * header of accordion A should NOT move focus to accordion B's first header.
 * Each accordion must manage keyboard focus within its own group.
 */

import { useRef, useCallback, useEffect } from 'react';

/**
 * Hook that manages keyboard navigation within an accordion group.
 * ArrowUp/Down move between headers, Home/End jump to first/last.
 * Scope is limited to the accordion container to prevent cross-accordion navigation.
 */
export function useAccordionKeyboard(
  containerRef: React.RefObject<HTMLElement | null>,
  itemCount: number,
) {
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  /**
   * Registers a header ref at the given index.
   */
  const registerItem = useCallback((index: number, el: HTMLButtonElement | null) => {
    itemRefs.current[index] = el;
  }, []);

  /**
   * Handles keyboard navigation within the accordion.
   */
  const onKeyDown = useCallback((e: React.KeyboardEvent, currentIndex: number) => {
    let targetIndex = currentIndex;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        targetIndex = (currentIndex + 1) % itemCount;
        break;
      case 'ArrowUp':
        e.preventDefault();
        targetIndex = (currentIndex - 1 + itemCount) % itemCount;
        break;
      case 'Home':
        e.preventDefault();
        targetIndex = 0;
        break;
      case 'End':
        e.preventDefault();
        targetIndex = itemCount - 1;
        break;
      default:
        return;
    }

    // Focus the target item
    itemRefs.current[targetIndex]?.focus();
  }, [itemCount]);

  return { registerItem, onKeyDown };
}
