"use client";

import { useCallback, useEffect, useState } from "react";
import type {
  FileItem,
  ViewMode,
  SortConfig,
  FilterCriteria,
  BulkOperationType,
} from "../lib/explorer-types";
import { useFileSelection } from "../hooks/use-file-selection";
import { useFileSort } from "../hooks/use-file-sort";
import { useFileFilter } from "../hooks/use-file-filter";
import { useDragDrop } from "../hooks/use-drag-drop";
import { FileGrid } from "./file-grid";
import { FileList } from "./file-list";
import { FileContextMenu } from "./file-context-menu";
import { ExplorerToolbar } from "./explorer-toolbar";
import { BulkActionBar } from "./bulk-action-bar";
import { bulkDelete, bulkMove, bulkCopy, downloadAsZip } from "../lib/bulk-operations";
import { formatFileSize } from "../lib/file-utils";

interface FileExplorerProps {
  initialFiles: FileItem[];
  initialPath?: string[];
  onNavigate?: (path: string[]) => void;
  onFileAction?: (action: string, item: FileItem) => void;
}

// Mock store - in production, use the Zustand store from explorer-store.ts
function useMockStore(initialFiles: FileItem[], initialPath: string[]) {
  const [fileList, setFileList] = useState(initialFiles);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [selectedIds, setSelectedIds] = useState(new Set<string>());
  const [anchorId, setAnchorId] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "name",
    direction: "asc",
  });
  const [filter, setFilter] = useState<FilterCriteria>({
    text: "",
    category: null,
    dateRange: { start: null, end: null },
    sizeRange: { min: null, max: null },
  });
  const [contextMenu, setContextMenu] = useState({
    isOpen: false,
    x: 0,
    y: 0,
    targetItem: null as FileItem | null,
  });
  const [breadcrumb, setBreadcrumb] = useState(initialPath);
  const [bulkOperation, setBulkOperation] = useState<null | {
    type: BulkOperationType;
    progress: number;
    isComplete: boolean;
    isCancelled: boolean;
  }>(null);

  const toggleSelection = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
    setAnchorId(id);
  }, []);

  const setSelectionRange = useCallback((ids: string[], anchor: string) => {
    setSelectedIds(new Set(ids));
    setAnchorId(anchor);
  }, []);

  const selectAll = useCallback((ids: string[]) => {
    setSelectedIds(new Set(ids));
    setAnchorId(ids[0] ?? null);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
    setAnchorId(null);
  }, []);

  return {
    fileList,
    setFileList,
    viewMode,
    setViewMode,
    selectedIds,
    anchorId,
    toggleSelection,
    setSelectionRange,
    selectAll,
    clearSelection,
    sortConfig,
    setSortConfig,
    filter,
    setFilter,
    contextMenu,
    setContextMenu,
    breadcrumb,
    setBreadcrumb,
    bulkOperation,
    setBulkOperation,
  };
}

export default function FileExplorer({
  initialFiles,
  initialPath = ["Home"],
  onNavigate,
  onFileAction,
}: FileExplorerProps) {
  const store = useMockStore(initialFiles, initialPath);

  // Pipeline: filter then sort
  const filteredFiles = useFileFilter(store.fileList, store.filter);
  const filteredAndSortedFiles = useFileSort(filteredFiles, store.sortConfig);

  // Selection hook
  const {
    handleClick,
    handleSelectAll,
    handleDeselectAll,
    isSelected,
    selectionCount,
  } = useFileSelection({
    filteredAndSortedFiles,
    selectedIds: store.selectedIds,
    anchorId: store.anchorId,
    onToggleSelection: store.toggleSelection,
    onSetSelectionRange: store.setSelectionRange,
    onSelectAll: store.selectAll,
    onClearSelection: store.clearSelection,
  });

  // Drag and drop hook
  const {
    dropTarget,
    onDragStart,
    onDragOver,
    onDragLeave,
    onDrop,
  } = useDragDrop({
    onInternalDrop: useCallback(
      (draggedIds: string[], targetFolderId: string) => {
        // In production, call the API to move files
        console.log(`Moving ${draggedIds.length} items to folder ${targetFolderId}`);
      },
      []
    ),
    onExternalDrop: useCallback((files: File[]) => {
      console.log(`Dropped ${files.length} files from desktop`);
    }, []),
  });

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        store.clearSelection();
        store.setContextMenu((prev) => ({ ...prev, isOpen: false }));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [store]);

  // Context menu handler
  const handleContextMenu = useCallback(
    (item: FileItem, event: React.MouseEvent) => {
      event.preventDefault();
      store.setContextMenu({
        isOpen: true,
        x: event.clientX,
        y: event.clientY,
        targetItem: item,
      });
    },
    [store]
  );

  // File actions
  const handleOpen = useCallback(
    (item: FileItem) => {
      if (item.type === "folder") {
        const newPath = [...store.breadcrumb, item.name];
        store.setBreadcrumb(newPath);
        onNavigate?.(newPath);
      }
      onFileAction?.("open", item);
    },
    [store, onNavigate, onFileAction]
  );

  const handleRename = useCallback(
    (item: FileItem) => {
      onFileAction?.("rename", item);
    },
    [onFileAction]
  );

  const handleDelete = useCallback(
    (item: FileItem) => {
      onFileAction?.("delete", item);
    },
    [onFileAction]
  );

  const handleMove = useCallback(
    (item: FileItem) => {
      onFileAction?.("move", item);
    },
    [onFileAction]
  );

  const handleCopy = useCallback(
    (item: FileItem) => {
      onFileAction?.("copy", item);
    },
    [onFileAction]
  );

  const handleDownload = useCallback(
    (item: FileItem) => {
      onFileAction?.("download", item);
    },
    [onFileAction]
  );

  const handleProperties = useCallback(
    (item: FileItem) => {
      onFileAction?.("properties", item);
    },
    [onFileAction]
  );

  // Bulk operations
  const handleBulkDelete = useCallback(async () => {
    const selectedFiles = filteredAndSortedFiles.filter((f) =>
      store.selectedIds.has(f.id)
    );
    const abortController = new AbortController();

    store.setBulkOperation({
      type: "delete",
      progress: 0,
      isComplete: false,
      isCancelled: false,
    });

    await bulkDelete(
      selectedFiles,
      async (item) => {
        // API call to delete file
        console.log("Deleting:", item.name);
      },
      (progress) => {
        store.setBulkOperation((prev) =>
          prev ? { ...prev, progress: progress.percentage } : null
        );
      },
      abortController.signal
    );

    store.clearSelection();
    store.setBulkOperation(null);
  }, [filteredAndSortedFiles, store]);

  const handleBulkMove = useCallback(() => {
    // Open move dialog
    console.log("Move dialog opened");
  }, []);

  const handleBulkCopy = useCallback(() => {
    // Open copy dialog
    console.log("Copy dialog opened");
  }, []);

  const handleBulkDownload = useCallback(async () => {
    const selectedFiles = filteredAndSortedFiles.filter((f) =>
      store.selectedIds.has(f.id)
    );

    store.setBulkOperation({
      type: "download",
      progress: 0,
      isComplete: false,
      isCancelled: false,
    });

    const abortController = new AbortController();

    await downloadAsZip(
      selectedFiles,
      async (item) => {
        // API call to fetch file content
        return new Response(new Blob([`Content of ${item.name}`]));
      },
      (progress) => {
        store.setBulkOperation((prev) =>
          prev ? { ...prev, progress: progress.percentage } : null
        );
      },
      abortController.signal
    );

    store.setBulkOperation(null);
  }, [filteredAndSortedFiles, store]);

  const handleCancelBulkOperation = useCallback(() => {
    store.setBulkOperation((prev) =>
      prev ? { ...prev, isCancelled: true } : null
    );
  }, [store]);

  // Breadcrumb click handler
  const handleBreadcrumbClick = useCallback(
    (index: number) => {
      const newPath = store.breadcrumb.slice(0, index + 1);
      store.setBreadcrumb(newPath);
      onNavigate?.(newPath);
      store.clearSelection();
    },
    [store, onNavigate]
  );

  return (
    <div className="flex h-full flex-col bg-white dark:bg-gray-900">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 border-b border-gray-200 bg-gray-50 px-4 py-2 text-sm dark:border-gray-700 dark:bg-gray-800">
        {store.breadcrumb.map((segment, index) => (
          <div key={index} className="flex items-center gap-1">
            {index > 0 && (
              <svg
                className="w-4 h-4 text-gray-400"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6h-6z" />
              </svg>
            )}
            <button
              onClick={() => handleBreadcrumbClick(index)}
              className={`rounded px-2 py-0.5 ${
                index === store.breadcrumb.length - 1
                  ? "font-medium text-gray-900 dark:text-gray-100"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              {segment}
            </button>
          </div>
        ))}
      </nav>

      {/* Toolbar */}
      <ExplorerToolbar
        viewMode={store.viewMode}
        sortConfig={store.sortConfig}
        filter={store.filter}
        selectionCount={selectionCount}
        onViewModeChange={store.setViewMode}
        onSortChange={store.setSortConfig}
        onFilterChange={store.setFilter}
        onSelectAll={handleSelectAll}
        onDeleteSelected={handleBulkDelete}
        onMoveSelected={handleBulkMove}
        onCopySelected={handleBulkCopy}
        onDownloadSelected={handleBulkDownload}
      />

      {/* File view */}
      <div
        className="flex flex-1 overflow-hidden"
        onDragOver={(e) => onDragOver(e)}
        onDragLeave={onDragLeave}
        onDrop={(e) => onDrop(e)}
      >
        {store.viewMode === "grid" ? (
          <FileGrid
            files={filteredAndSortedFiles}
            selectedIds={store.selectedIds}
            onClick={handleClick}
            onContextMenu={handleContextMenu}
            onOpen={handleOpen}
          />
        ) : (
          <FileList
            files={filteredAndSortedFiles}
            selectedIds={store.selectedIds}
            sortConfig={store.sortConfig}
            onClick={handleClick}
            onContextMenu={handleContextMenu}
            onOpen={handleOpen}
            onSortChange={store.setSortConfig}
          />
        )}
      </div>

      {/* Context menu */}
      <FileContextMenu
        isOpen={store.contextMenu.isOpen}
        x={store.contextMenu.x}
        y={store.contextMenu.y}
        targetItem={store.contextMenu.targetItem}
        onClose={() =>
          store.setContextMenu((prev) => ({ ...prev, isOpen: false }))
        }
        onOpen={handleOpen}
        onRename={handleRename}
        onDelete={handleDelete}
        onMove={handleMove}
        onCopy={handleCopy}
        onDownload={handleDownload}
        onProperties={handleProperties}
      />

      {/* Bulk action bar */}
      <BulkActionBar
        selectionCount={selectionCount}
        bulkOperation={store.bulkOperation}
        onDelete={handleBulkDelete}
        onMove={handleBulkMove}
        onCopy={handleBulkCopy}
        onDownload={handleBulkDownload}
        onCancel={handleCancelBulkOperation}
        onClearSelection={store.clearSelection}
      />
    </div>
  );
}
