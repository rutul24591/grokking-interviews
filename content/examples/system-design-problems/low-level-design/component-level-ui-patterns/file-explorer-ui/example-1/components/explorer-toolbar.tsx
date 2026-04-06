"use client";

import { useState, useCallback, useEffect } from "react";
import type { ViewMode, SortConfig, SortKey, SortDirection, FilterCriteria } from "../lib/explorer-types";

interface ExplorerToolbarProps {
  viewMode: ViewMode;
  sortConfig: SortConfig;
  filter: FilterCriteria;
  selectionCount: number;
  onViewModeChange: (mode: ViewMode) => void;
  onSortChange: (config: SortConfig) => void;
  onFilterChange: (criteria: Partial<FilterCriteria>) => void;
  onSelectAll: () => void;
  onDeleteSelected: () => void;
  onMoveSelected: () => void;
  onCopySelected: () => void;
  onDownloadSelected: () => void;
}

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "name", label: "Name" },
  { key: "size", label: "Size" },
  { key: "type", label: "Type" },
  { key: "dateModified", label: "Date Modified" },
];

export function ExplorerToolbar({
  viewMode,
  sortConfig,
  filter,
  selectionCount,
  onViewModeChange,
  onSortChange,
  onFilterChange,
  onSelectAll,
  onDeleteSelected,
  onMoveSelected,
  onCopySelected,
  onDownloadSelected,
}: ExplorerToolbarProps) {
  const [searchInput, setSearchInput] = useState(filter.text);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      onFilterChange({ text: searchInput });
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput, onFilterChange]);

  const handleSortToggle = useCallback(
    (key: SortKey) => {
      if (sortConfig.key === key) {
        // Toggle direction
        const newDirection: SortDirection =
          sortConfig.direction === "asc" ? "desc" : "asc";
        onSortChange({ key, direction: newDirection });
      } else {
        // New key, default to ascending
        onSortChange({ key, direction: "asc" });
      }
    },
    [sortConfig, onSortChange]
  );

  return (
    <div className="flex flex-wrap items-center gap-3 border-b border-gray-200 bg-white px-4 py-2 dark:border-gray-700 dark:bg-gray-900">
      {/* View mode toggle */}
      <div className="flex items-center rounded-lg border border-gray-200 dark:border-gray-700">
        <button
          className={`p-1.5 ${
            viewMode === "grid"
              ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
              : "text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
          }`}
          onClick={() => onViewModeChange("grid")}
          aria-label="Grid view"
          aria-pressed={viewMode === "grid"}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 3h8v8H3V3zm0 10h8v8H3v-8zm10-10h8v8h-8V3zm0 10h8v8h-8v-8z" />
          </svg>
        </button>
        <button
          className={`p-1.5 ${
            viewMode === "list"
              ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
              : "text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
          }`}
          onClick={() => onViewModeChange("list")}
          aria-label="List view"
          aria-pressed={viewMode === "list"}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 4h18v2H3V4zm0 7h18v2H3v-2zm0 7h18v2H3v-2z" />
          </svg>
        </button>
      </div>

      {/* Search input */}
      <div className="relative flex-1 min-w-48">
        <svg
          className="absolute left-3 top-1/2 w-4 h-4 -translate-y-1/2 text-gray-400"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
        </svg>
        <input
          type="text"
          placeholder="Search files..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="w-full rounded-lg border border-gray-200 bg-gray-50 py-1.5 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
        />
      </div>

      {/* Sort controls */}
      <div className="flex items-center gap-1">
        {SORT_OPTIONS.map((option) => {
          const isActive = sortConfig.key === option.key;
          return (
            <button
              key={option.key}
              onClick={() => handleSortToggle(option.key)}
              className={`flex items-center gap-1 rounded-md px-2 py-1 text-xs ${
                isActive
                  ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
                  : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
              }`}
            >
              {option.label}
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

      {/* Bulk action buttons (visible when items selected) */}
      {selectionCount > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {selectionCount} selected
          </span>
          <button
            onClick={onSelectAll}
            className="rounded-md px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            Select All
          </button>
          <button
            onClick={onDeleteSelected}
            className="rounded-md px-2 py-1 text-xs text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
          >
            Delete
          </button>
          <button
            onClick={onMoveSelected}
            className="rounded-md px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            Move
          </button>
          <button
            onClick={onCopySelected}
            className="rounded-md px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            Copy
          </button>
          <button
            onClick={onDownloadSelected}
            className="rounded-md px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            Download
          </button>
        </div>
      )}
    </div>
  );
}
