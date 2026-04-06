import { useCallback } from 'react';
import { useTreeStore } from '../lib/tree-store';

/**
 * Hook for multi-select operations.
 * Handles Ctrl+Click toggle, Shift+Click range, select/deselect all.
 */
export function useTreeSelection() {
  const selectedIds = useTreeStore((state) => state.selectedIds);
  const lastSelectedId = useTreeStore((state) => state.lastSelectedId);
  const selectNode = useTreeStore((state) => state.selectNode);
  const deselectNode = useTreeStore((state) => state.deselectNode);
  const selectAll = useTreeStore((state) => state.selectAll);
  const deselectAll = useTreeStore((state) => state.deselectAll);

  const handleSelect = useCallback(
    (id: string, multi: boolean, range: boolean, visibleIds: string[]) => {
      selectNode(id, multi, range, visibleIds);
    },
    [selectNode]
  );

  const handleDeselect = useCallback(
    (id: string) => {
      deselectNode(id);
    },
    [deselectNode]
  );

  const handleSelectAll = useCallback(
    (visibleIds: string[]) => {
      selectAll(visibleIds);
    },
    [selectAll]
  );

  const handleDeselectAll = useCallback(() => {
    deselectAll();
  }, [deselectAll]);

  return {
    selectedIds,
    lastSelectedId,
    handleSelect,
    handleDeselect,
    handleSelectAll,
    handleDeselectAll,
  };
}
