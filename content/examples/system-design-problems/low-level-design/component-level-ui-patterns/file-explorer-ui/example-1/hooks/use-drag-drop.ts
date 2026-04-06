import { useState, useCallback, useRef } from "react";
import type { FileItem } from "../lib/explorer-types";

type DragSource = "internal" | "external";

interface UseDragDropArgs {
  onInternalDrop: (draggedIds: string[], targetFolderId: string) => void;
  onExternalDrop?: (files: File[]) => void;
}

interface UseDragDropReturn {
  isDragging: boolean;
  dragSource: DragSource | null;
  dropTarget: FileItem | null;
  onDragStart: (item: FileItem, event: React.DragEvent) => void;
  onDragOver: (event: React.DragEvent, targetItem?: FileItem) => void;
  onDragLeave: () => void;
  onDrop: (event: React.DragEvent, targetItem?: FileItem) => void;
}

export function useDragDrop({
  onInternalDrop,
  onExternalDrop,
}: UseDragDropArgs): UseDragDropReturn {
  const [isDragging, setIsDragging] = useState(false);
  const [dragSource, setDragSource] = useState<DragSource | null>(null);
  const [dropTarget, setDropTarget] = useState<FileItem | null>(null);
  const draggedIdsRef = useRef<string[]>([]);

  const onDragStart = useCallback((item: FileItem, event: React.DragEvent) => {
    const ids = [item.id];
    draggedIdsRef.current = ids;

    event.dataTransfer.setData(
      "application/x-explorer-file-ids",
      JSON.stringify(ids)
    );
    event.dataTransfer.effectAllowed = "move";
    setDragSource("internal");
    setIsDragging(true);
  }, []);

  const onDragOver = useCallback(
    (event: React.DragEvent, targetItem?: FileItem) => {
      event.preventDefault();

      // Check if this is an internal or external drag
      const hasInternalData =
        event.dataTransfer.types.includes("application/x-explorer-file-ids");
      const hasExternalData = event.dataTransfer.types.includes("Files");

      if (hasInternalData || hasExternalData) {
        event.dataTransfer.dropEffect = "move";

        if (targetItem && targetItem.type === "folder") {
          setDropTarget(targetItem);
        } else if (!targetItem) {
          // Dropping on empty area — valid for external files
          setDropTarget(null);
        }
      }
    },
    []
  );

  const onDragLeave = useCallback(() => {
    setDropTarget(null);
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent, targetItem?: FileItem) => {
      event.preventDefault();
      setIsDragging(false);
      setDropTarget(null);

      // Check for internal drag (file IDs)
      const internalData = event.dataTransfer.getData(
        "application/x-explorer-file-ids"
      );

      if (internalData) {
        try {
          const ids: string[] = JSON.parse(internalData);
          if (targetItem && targetItem.type === "folder") {
            onInternalDrop(ids, targetItem.id);
          }
        } catch {
          // Invalid data, ignore
        }
        return;
      }

      // Check for external drag (desktop files)
      if (event.dataTransfer.files.length > 0 && onExternalDrop) {
        const droppedFiles = Array.from(event.dataTransfer.files);
        onExternalDrop(droppedFiles);
      }
    },
    [onInternalDrop, onExternalDrop]
  );

  return {
    isDragging,
    dragSource,
    dropTarget,
    onDragStart,
    onDragOver,
    onDragLeave,
    onDrop,
  };
}
