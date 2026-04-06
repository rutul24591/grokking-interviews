'use client';

import React from 'react';
import { useTreeSearch } from '../hooks/use-tree-search';

/**
 * Search input with real-time filtering.
 * Debounced input that filters the tree by node name.
 */
export function TreeSearchBar() {
  const { inputValue, handleInputChange, handleClear, hasActiveSearch } =
    useTreeSearch(300);

  return (
    <div className="relative border-b border-theme bg-panel-soft px-3 py-2">
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Search files and folders..."
          className="w-full rounded-md border border-theme bg-background px-3 py-1.5 pr-8 text-sm text-foreground placeholder-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          aria-label="Search tree"
        />
        {hasActiveSearch && (
          <button
            onClick={handleClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>
      {hasActiveSearch && (
        <div className="mt-1 text-xs text-muted-foreground">
          Filtering results for &quot;{inputValue}&quot;
        </div>
      )}
    </div>
  );
}
