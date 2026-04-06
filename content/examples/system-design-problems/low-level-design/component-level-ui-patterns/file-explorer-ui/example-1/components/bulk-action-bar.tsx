"use client";

import type { BulkOperationState } from "../lib/explorer-types";

interface BulkActionBarProps {
  selectionCount: number;
  bulkOperation: BulkOperationState | null;
  onDelete: () => void;
  onMove: () => void;
  onCopy: () => void;
  onDownload: () => void;
  onCancel: () => void;
  onClearSelection: () => void;
}

export function BulkActionBar({
  selectionCount,
  bulkOperation,
  onDelete,
  onMove,
  onCopy,
  onDownload,
  onCancel,
  onClearSelection,
}: BulkActionBarProps) {
  if (selectionCount === 0 && !bulkOperation) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white px-6 py-3 shadow-lg dark:border-gray-700 dark:bg-gray-900">
      <div className="mx-auto flex max-w-5xl items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
            {selectionCount} item{selectionCount !== 1 ? "s" : ""} selected
          </span>
          <button
            onClick={onClearSelection}
            className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            Clear
          </button>
        </div>

        {bulkOperation && !bulkOperation.isComplete ? (
          <div className="flex flex-1 items-center gap-4">
            <div className="flex-1">
              <div className="mb-1 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>
                  {bulkOperation.type === "delete" && "Deleting files..."}
                  {bulkOperation.type === "move" && "Moving files..."}
                  {bulkOperation.type === "copy" && "Copying files..."}
                  {bulkOperation.type === "download" && "Creating archive..."}
                </span>
                <span>{bulkOperation.progress}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                <div
                  className="h-full bg-blue-600 transition-all duration-300"
                  style={{ width: `${bulkOperation.progress}%` }}
                />
              </div>
            </div>
            <button
              onClick={onCancel}
              className="rounded-md px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={onDelete}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
              Delete
            </button>
            <button
              onClick={onMove}
              className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              Move
            </button>
            <button
              onClick={onCopy}
              className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              Copy
            </button>
            <button
              onClick={onDownload}
              className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              Download as ZIP
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
