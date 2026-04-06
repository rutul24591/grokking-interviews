"use client";

import { useCallback } from "react";
import type { FileItem } from "../lib/explorer-types";
import { FileThumbnail } from "./file-thumbnail";

interface FileGridProps {
  files: FileItem[];
  selectedIds: Set<string>;
  onClick: (item: FileItem, event: React.MouseEvent) => void;
  onContextMenu: (item: FileItem, event: React.MouseEvent) => void;
  onOpen: (item: FileItem) => void;
}

export function FileGrid({
  files,
  selectedIds,
  onClick,
  onContextMenu,
  onOpen,
}: FileGridProps) {
  const handleDoubleClick = useCallback(
    (item: FileItem) => {
      onOpen(item);
    },
    [onOpen]
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
    <div
      className="grid flex-1 gap-4 p-4"
      style={{
        gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
      }}
      role="grid"
      aria-label="File grid"
    >
      {files.map((item) => {
        const isSelected = selectedIds.has(item.id);
        return (
          <div
            key={item.id}
            role="gridcell"
            tabIndex={0}
            aria-selected={isSelected}
            className={`group flex cursor-pointer flex-col items-center gap-2 rounded-lg p-3 transition-colors ${
              isSelected
                ? "bg-blue-100 ring-2 ring-blue-500 dark:bg-blue-900/40 dark:ring-blue-400"
                : "hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
            onClick={(e) => onClick(item, e)}
            onDoubleClick={() => handleDoubleClick(item)}
            onContextMenu={(e) => onContextMenu(item, e)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onOpen(item);
              }
            }}
          >
            <FileThumbnail file={item} size="medium" />
            <span
              className="w-full truncate text-center text-sm text-gray-700 dark:text-gray-200"
              title={item.name}
            >
              {item.name}
            </span>
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {item.type === "folder"
                ? "Folder"
                : new Intl.NumberFormat(undefined, {
                    style: "unit",
                    unit: "byte",
                    unitDisplay: "narrow",
                  }).format(item.size)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
