"use client";

import { useCallback } from "react";
import type { FileItem, SortConfig, SortKey, SortDirection } from "../lib/explorer-types";
import { FileThumbnail } from "./file-thumbnail";
import { formatFileSize } from "../lib/file-utils";

interface FileListProps {
  files: FileItem[];
  selectedIds: Set<string>;
  sortConfig: SortConfig;
  onClick: (item: FileItem, event: React.MouseEvent) => void;
  onContextMenu: (item: FileItem, event: React.MouseEvent) => void;
  onOpen: (item: FileItem) => void;
  onSortChange: (config: SortConfig) => void;
}

const COLUMNS: { key: SortKey; label: string; className?: string }[] = [
  { key: "name", label: "Name", className: "flex-1" },
  { key: "size", label: "Size", className: "w-24" },
  { key: "type", label: "Type", className: "w-32" },
  { key: "dateModified", label: "Modified", className: "w-40" },
];

function FileListRow({
  item,
  isSelected,
  onClick,
  onDoubleClick,
  onContextMenu,
}: {
  item: FileItem;
  isSelected: boolean;
  onClick: (e: React.MouseEvent) => void;
  onDoubleClick: () => void;
  onContextMenu: (e: React.MouseEvent) => void;
}) {
  return (
    <div
      role="row"
      aria-selected={isSelected}
      tabIndex={0}
      className={`flex cursor-pointer items-center gap-3 border-b border-gray-100 px-4 py-2 transition-colors last:border-b-0 dark:border-gray-800 ${
        isSelected
          ? "bg-blue-100 dark:bg-blue-900/40"
          : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
      }`}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onContextMenu={onContextMenu}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          onDoubleClick();
        }
      }}
    >
      <div className="w-8 flex-shrink-0">
        <FileThumbnail file={item} size="small" />
      </div>
      <span className="flex-1 truncate text-sm text-gray-700 dark:text-gray-200">
        {item.name}
      </span>
      <span className="w-24 text-right text-sm text-gray-500 dark:text-gray-400">
        {item.type === "folder" ? "--" : formatFileSize(item.size)}
      </span>
      <span className="w-32 text-sm text-gray-500 dark:text-gray-400">
        {item.category ?? item.extension.toUpperCase()}
      </span>
      <span className="w-40 text-sm text-gray-500 dark:text-gray-400">
        {new Date(item.modifiedAt).toLocaleDateString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </span>
    </div>
  );
}

export function FileList({
  files,
  selectedIds,
  sortConfig,
  onClick,
  onContextMenu,
  onOpen,
  onSortChange,
}: FileListProps) {
  const handleSortToggle = useCallback(
    (key: SortKey) => {
      if (sortConfig.key === key) {
        const newDirection: SortDirection =
          sortConfig.direction === "asc" ? "desc" : "asc";
        onSortChange({ key, direction: newDirection });
      } else {
        onSortChange({ key, direction: "asc" });
      }
    },
    [sortConfig, onSortChange]
  );

  if (files.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center py-16">
        <div className="text-center">
          <svg
            className="mx-auto mb-4 w-16 h-16 text-gray-300 dark:text-gray-600"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M20 6h-8l-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10z" />
          </svg>
          <p className="text-gray-500 dark:text-gray-400">
            This folder is empty
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col" role="treegrid" aria-label="File list">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-gray-200 bg-gray-50 px-4 py-2 text-xs font-medium uppercase tracking-wider text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
        <div className="w-8 flex-shrink-0" />
        {COLUMNS.map((col) => {
          const isActive = sortConfig.key === col.key;
          return (
            <button
              key={col.key}
              onClick={() => handleSortToggle(col.key)}
              className={`${col.className} flex cursor-pointer items-center gap-1 text-left hover:text-gray-700 dark:hover:text-gray-200`}
            >
              {col.label}
              {isActive && (
                <svg
                  className={`w-3 h-3 transition-transform ${
                    sortConfig.direction === "desc" ? "rotate-180" : ""
                  }`}
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M7 14l5-5 5 5H7z" />
                </svg>
              )}
            </button>
          );
        })}
      </div>

      {/* Rows */}
      <div className="flex-1 overflow-y-auto">
        {files.map((item) => (
          <FileListRow
            key={item.id}
            item={item}
            isSelected={selectedIds.has(item.id)}
            onClick={(e) => onClick(item, e)}
            onDoubleClick={() => onOpen(item)}
            onContextMenu={(e) => onContextMenu(item, e)}
          />
        ))}
      </div>
    </div>
  );
}
