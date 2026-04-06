// Core type definitions for the File Explorer UI

export type FileType = "file" | "folder";

export type FileCategory =
  | "image"
  | "document"
  | "video"
  | "audio"
  | "archive"
  | "code"
  | "spreadsheet"
  | "presentation"
  | "font"
  | "executable"
  | "other";

export type ViewMode = "grid" | "list";

export type SortKey = "name" | "size" | "type" | "dateModified";

export type SortDirection = "asc" | "desc";

export interface FileItem {
  id: string;
  name: string;
  type: FileType;
  category?: FileCategory;
  mimeType?: string;
  size: number;
  modifiedAt: string;
  createdAt?: string;
  thumbnailUrl?: string;
  parentId: string | null;
  extension: string;
  permissions?: {
    read: boolean;
    write: boolean;
    delete: boolean;
    share: boolean;
  };
  metadata?: Record<string, unknown>;
}

export interface SortConfig {
  key: SortKey;
  direction: SortDirection;
}

export interface SelectionState {
  selectedIds: Set<string>;
  anchorId: string | null;
  selectAll: boolean;
}

export interface ContextMenuState {
  isOpen: boolean;
  x: number;
  y: number;
  targetItem: FileItem | null;
}

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

export interface SizeRange {
  min: number | null;
  max: number | null;
}

export interface FilterCriteria {
  text: string;
  category: FileCategory | null;
  dateRange: DateRange;
  sizeRange: SizeRange;
}

export type BulkOperationType = "delete" | "move" | "copy" | "download";

export interface BulkOperationResult {
  total: number;
  succeeded: number;
  failed: number;
  errors: Record<string, string>;
}

export interface BulkOperationState {
  type: BulkOperationType;
  progress: number;
  abortController: AbortController;
  result: BulkOperationResult | null;
  isComplete: boolean;
  isCancelled: boolean;
}

export interface BreadcrumbSegment {
  label: string;
  path: string;
}
