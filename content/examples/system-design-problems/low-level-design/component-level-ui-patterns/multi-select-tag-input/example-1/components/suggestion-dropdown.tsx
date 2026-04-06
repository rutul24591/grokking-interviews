'use client';

import React from 'react';
import { SuggestionOption } from './suggestion-option';
import type { SuggestionGroup, Tag } from '../lib/multi-select-types';

interface SuggestionDropdownProps<T = Record<string, unknown>> {
  groups: SuggestionGroup<T>[];
  isLoading: boolean;
  error: Error | null;
  highlightedIndex: number;
  onHighlight: (index: number) => void;
  onSelect: (tag: Tag<T>) => void;
  onRetry: () => void;
  allowCreate: boolean;
  inputValue: string;
  totalCount: number;
}

export function SuggestionDropdown<T = Record<string, unknown>>({
  groups,
  isLoading,
  error,
  highlightedIndex,
  onHighlight,
  onSelect,
  onRetry,
  allowCreate,
  inputValue,
  totalCount,
}: SuggestionDropdownProps<T>) {
  // Compute a flat index across all groups for keyboard navigation
  const flatOptions: Array<{ suggestion: Tag<T>; groupIndex: number; optionIndex: number }> = [];
  groups.forEach((group, gi) => {
    group.suggestions.forEach((suggestion, oi) => {
      flatOptions.push({ suggestion, groupIndex: gi, optionIndex: oi });
    });
  });

  // Add "Create" option if allowCreate and input has value with no exact match
  const showCreateOption =
    allowCreate &&
    inputValue.trim() &&
    !flatOptions.some(
      (o) => o.suggestion.label.toLowerCase() === inputValue.toLowerCase()
    );

  const totalWithCreate = showCreateOption ? totalCount + 1 : totalCount;

  return (
    <div
      className="absolute z-50 mt-1 w-full rounded-lg border border-theme bg-panel shadow-lg max-h-[280px] overflow-y-auto"
      role="listbox"
      aria-label="Suggestions"
      aria-multiselectable="true"
    >
      {/* Loading state */}
      {isLoading && (
        <div className="flex items-center justify-center py-6" role="status">
          <svg
            className="w-5 h-5 animate-spin text-accent"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="3"
              strokeOpacity="0.25"
            />
            <path
              d="M12 2C6.48 2 2 6.48 2 12"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
          <span className="ml-2 text-sm text-muted">Loading...</span>
        </div>
      )}

      {/* Error state */}
      {error && !isLoading && (
        <div className="flex flex-col items-center justify-center py-6" role="alert">
          <svg
            className="w-6 h-6 text-error mb-2"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
            <path
              d="M12 8v4M12 16h.01"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <p className="text-sm text-error mb-2">Failed to load suggestions</p>
          <button
            type="button"
            onClick={onRetry}
            className="text-xs px-3 py-1 rounded bg-accent/10 text-accent hover:bg-accent/20 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !error && totalCount === 0 && !showCreateOption && (
        <div className="flex flex-col items-center justify-center py-6">
          <svg
            className="w-8 h-8 text-muted mb-2"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
            <path
              d="M16 16L21 21"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <p className="text-sm text-muted">No results found</p>
          {allowCreate && (
            <p className="text-xs text-muted mt-1">
              Press Enter to create &quot;{inputValue}&quot;
            </p>
          )}
        </div>
      )}

      {/* Grouped suggestions */}
      {!isLoading && (!error || totalCount > 0) && (
        <div>
          {groups.map((group, groupIndex) => (
            <div key={group.id}>
              {groups.length > 1 && (
                <div className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted bg-panel-soft border-b border-theme">
                  {group.label} ({group.suggestions.length})
                </div>
              )}
              {group.suggestions.map((suggestion, optionIndex) => {
                const flatIndex = flatOptions.findIndex(
                  (o) =>
                    o.groupIndex === groupIndex && o.optionIndex === optionIndex
                );
                return (
                  <SuggestionOption
                    key={suggestion.id}
                    suggestion={suggestion}
                    isHighlighted={flatIndex === highlightedIndex}
                    onSelect={() => onSelect(suggestion)}
                    onHighlight={() => onHighlight(flatIndex)}
                  />
                );
              })}
            </div>
          ))}

          {/* Create new tag option */}
          {showCreateOption && (
            <div
              className="px-3 py-2 text-sm cursor-pointer hover:bg-accent/10 transition-colors border-t border-theme"
              role="option"
              aria-selected={highlightedIndex === totalWithCreate - 1}
              onClick={() =>
                onSelect({
                  id: `custom-${Date.now()}`,
                  label: inputValue.trim(),
                } as Tag<T>)
              }
            >
              <span className="text-muted">Create</span>{' '}
              <span className="font-medium">&quot;{inputValue.trim()}&quot;</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
