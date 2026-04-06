import { create } from "zustand";
import type {
  FileItem,
  ViewMode,
  SortConfig,
  SelectionState,
  ContextMenuState,
  FilterCriteria,
  BulkOperationState,
  BulkOperationType,
  BulkOperationResult,
} from "../lib/explorer-types";

interface ExplorerStore {
  // File list
  fileList: FileItem[];
  setFileList: (files: FileItem[]) => void;

  // View mode
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;

  // Selection
  selection: SelectionState;
  toggleSelection: (id: string) => void;
  setSelectionRange: (ids: string[], anchorId: string) => void;
  selectAll: (ids: string[]) => void;
  clearSelection: () => void;

  // Sort
  sortConfig: SortConfig;
  setSortConfig: (config: SortConfig) => void;

  // Filter
  filter: FilterCriteria;
  setFilter: (criteria: Partial<FilterCriteria>) => void;

  // Context menu
  contextMenu: ContextMenuState;
  openContextMenu: (x: number, y: number, item: FileItem) => void;
  closeContextMenu: () => void;

  // Breadcrumb
  breadcrumb: string[];
  setBreadcrumb: (path: string[]) => void;

  // Bulk operations
  bulkOperation: BulkOperationState | null;
  startBulkOperation: (type: BulkOperationType) => void;
  updateBulkProgress: (progress: number) => void;
  completeBulkOperation: (result: BulkOperationResult) => void;
  cancelBulkOperation: () => void;
}

export const createExplorerStore = () =>
  create<ExplorerStore>((set) => ({
    // File list
    fileList: [],
    setFileList: (files) => set({ fileList: files }),

    // View mode
    viewMode: "grid",
    setViewMode: (mode) => set({ viewMode: mode }),

    // Selection
    selection: {
      selectedIds: new Set<string>(),
      anchorId: null,
      selectAll: false,
    },
    toggleSelection: (id) =>
      set((state) => {
        const newSet = new Set(state.selection.selectedIds);
        if (newSet.has(id)) {
          newSet.delete(id);
        } else {
          newSet.add(id);
        }
        return {
          selection: {
            ...state.selection,
            selectedIds: newSet,
            anchorId: id,
            selectAll: false,
          },
        };
      }),
    setSelectionRange: (ids, anchorId) =>
      set(() => ({
        selection: {
          selectedIds: new Set(ids),
          anchorId,
          selectAll: false,
        },
      })),
    selectAll: (ids) =>
      set(() => ({
        selection: {
          selectedIds: new Set(ids),
          anchorId: ids[0] ?? null,
          selectAll: true,
        },
      })),
    clearSelection: () =>
      set(() => ({
        selection: {
          selectedIds: new Set<string>(),
          anchorId: null,
          selectAll: false,
        },
      })),

    // Sort
    sortConfig: { key: "name", direction: "asc" },
    setSortConfig: (config) => set({ sortConfig: config }),

    // Filter
    filter: {
      text: "",
      category: null,
      dateRange: { start: null, end: null },
      sizeRange: { min: null, max: null },
    },
    setFilter: (criteria) =>
      set((state) => ({
        filter: { ...state.filter, ...criteria },
      })),

    // Context menu
    contextMenu: {
      isOpen: false,
      x: 0,
      y: 0,
      targetItem: null,
    },
    openContextMenu: (x, y, item) =>
      set({ contextMenu: { isOpen: true, x, y, targetItem: item } }),
    closeContextMenu: () =>
      set((state) => ({
        contextMenu: { ...state.contextMenu, isOpen: false, targetItem: null },
      })),

    // Breadcrumb
    breadcrumb: ["Home"],
    setBreadcrumb: (path) => set({ breadcrumb: path }),

    // Bulk operations
    bulkOperation: null,
    startBulkOperation: (type) =>
      set(() => ({
        bulkOperation: {
          type,
          progress: 0,
          abortController: new AbortController(),
          result: null,
          isComplete: false,
          isCancelled: false,
        },
      })),
    updateBulkProgress: (progress) =>
      set((state) => {
        if (!state.bulkOperation) return {};
        return {
          bulkOperation: { ...state.bulkOperation, progress },
        };
      }),
    completeBulkOperation: (result) =>
      set((state) => {
        if (!state.bulkOperation) return {};
        return {
          bulkOperation: {
            ...state.bulkOperation,
            result,
            progress: 100,
            isComplete: true,
          },
        };
      }),
    cancelBulkOperation: () =>
      set((state) => {
        if (!state.bulkOperation) return {};
        state.bulkOperation.abortController.abort();
        return {
          bulkOperation: {
            ...state.bulkOperation,
            isCancelled: true,
          },
        };
      }),
  }));

export type ExplorerStore = ReturnType<typeof createExplorerStore>;
