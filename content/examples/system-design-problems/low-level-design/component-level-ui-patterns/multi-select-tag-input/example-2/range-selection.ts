/**
 * Multi-Select Range — Shift+click for range selection in tag input.
 *
 * Interview edge case: User has 100 suggestions, clicks suggestion #5, then
 * Shift+clicks suggestion #15. All suggestions from 5-15 should be selected.
 * Must handle: first click sets anchor, shift-click selects range, ctrl+click toggles.
 */

import { useState, useCallback } from 'react';

interface SelectionState {
  selectedIds: Set<string>;
  anchorIndex: number | null;
  lastSelectedIndex: number | null;
}

/**
 * Hook that manages selection state for tag input with range support.
 */
export function useMultiSelectRange<T extends { id: string }>(
  items: T[],
  maxSelected?: number,
) {
  const [state, setState] = useState<SelectionState>({
    selectedIds: new Set(),
    anchorIndex: null,
    lastSelectedIndex: null,
  });

  /**
   * Handles click on an item. Supports:
   * - Normal click: toggle selection, set anchor
   * - Shift+click: select range from anchor to current
   * - Ctrl+click: toggle without changing anchor
   */
  const onItemClick = useCallback((index: number, isShift: boolean, isCtrl: boolean) => {
    setState((prev) => {
      const newSelected = new Set(prev.selectedIds);

      if (isShift && prev.anchorIndex !== null) {
        // Range selection
        const start = Math.min(prev.anchorIndex, index);
        const end = Math.max(prev.anchorIndex, index);
        for (let i = start; i <= end; i++) {
          if (maxSelected && newSelected.size >= maxSelected) break;
          newSelected.add(items[i].id);
        }
      } else if (isCtrl) {
        // Toggle without changing anchor
        if (newSelected.has(items[index].id)) {
          newSelected.delete(items[index].id);
        } else {
          if (maxSelected && newSelected.size >= maxSelected) return prev;
          newSelected.add(items[index].id);
        }
      } else {
        // Normal click: set anchor and toggle
        if (newSelected.has(items[index].id)) {
          newSelected.delete(items[index].id);
        } else {
          if (maxSelected && newSelected.size >= maxSelected) return prev;
          newSelected.add(items[index].id);
        }
        return {
          selectedIds: newSelected,
          anchorIndex: index,
          lastSelectedIndex: index,
        };
      }

      return {
        selectedIds: newSelected,
        anchorIndex: prev.anchorIndex ?? index,
        lastSelectedIndex: index,
      };
    });
  }, [items, maxSelected]);

  /**
   * Selects all items (up to maxSelected).
   */
  const selectAll = useCallback(() => {
    const limit = maxSelected ?? items.length;
    setState({
      selectedIds: new Set(items.slice(0, limit).map((item) => item.id)),
      anchorIndex: 0,
      lastSelectedIndex: Math.min(limit - 1, items.length - 1),
    });
  }, [items, maxSelected]);

  /**
   * Clears all selection.
   */
  const clearSelection = useCallback(() => {
    setState({ selectedIds: new Set(), anchorIndex: null, lastSelectedIndex: null });
  }, []);

  return {
    selectedIds: state.selectedIds,
    onItemClick,
    selectAll,
    clearSelection,
    isSelected: (id: string) => state.selectedIds.has(id),
  };
}
