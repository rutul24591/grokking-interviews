import { useCallback } from "react";
import type { FileItem } from "../lib/explorer-types";

interface UseFileSelectionArgs {
  filteredAndSortedFiles: FileItem[];
  selectedIds: Set<string>;
  anchorId: string | null;
  onToggleSelection: (id: string) => void;
  onSetSelectionRange: (ids: string[], anchorId: string) => void;
  onSelectAll: (ids: string[]) => void;
  onClearSelection: () => void;
}

export function useFileSelection({
  filteredAndSortedFiles,
  selectedIds,
  anchorId,
  onToggleSelection,
  onSetSelectionRange,
  onSelectAll,
  onClearSelection,
}: UseFileSelectionArgs) {
  const handleClick = useCallback(
    (item: FileItem, event: React.MouseEvent) => {
      if (event.ctrlKey || event.metaKey) {
        // Ctrl+click: toggle selection
        onToggleSelection(item.id);
      } else if (event.shiftKey && anchorId !== null) {
        // Shift+click: range selection
        const anchorIndex = filteredAndSortedFiles.findIndex(
          (f) => f.id === anchorId
        );
        const currentIndex = filteredAndSortedFiles.findIndex(
          (f) => f.id === item.id
        );

        if (anchorIndex === -1 || currentIndex === -1) {
          onToggleSelection(item.id);
          return;
        }

        const start = Math.min(anchorIndex, currentIndex);
        const end = Math.max(anchorIndex, currentIndex);
        const rangeIds = filteredAndSortedFiles
          .slice(start, end + 1)
          .map((f) => f.id);

        onSetSelectionRange(rangeIds, anchorId);
      } else {
        // Single click: select only this item
        onSetSelectionRange([item.id], item.id);
      }
    },
    [
      anchorId,
      filteredAndSortedFiles,
      onToggleSelection,
      onSetSelectionRange,
    ]
  );

  const handleSelectAll = useCallback(() => {
    const allIds = filteredAndSortedFiles.map((f) => f.id);
    onSelectAll(allIds);
  }, [filteredAndSortedFiles, onSelectAll]);

  const handleDeselectAll = useCallback(() => {
    onClearSelection();
  }, [onClearSelection]);

  const isSelected = useCallback(
    (id: string) => selectedIds.has(id),
    [selectedIds]
  );

  const selectionCount = selectedIds.size;

  return {
    handleClick,
    handleSelectAll,
    handleDeselectAll,
    isSelected,
    selectionCount,
  };
}
