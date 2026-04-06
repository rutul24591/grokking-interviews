'use client';

import React, { useRef, useEffect } from 'react';
import type { Tag } from '../lib/multi-select-types';

interface SuggestionOptionProps<T = Record<string, unknown>> {
  suggestion: Tag<T>;
  isHighlighted: boolean;
  isAlreadySelected?: boolean;
  onSelect: () => void;
  onHighlight: () => void;
}

export function SuggestionOption<T = Record<string, unknown>>({
  suggestion,
  isHighlighted,
  isAlreadySelected = false,
  onSelect,
  onHighlight,
}: SuggestionOptionProps<T>) {
  const optionRef = useRef<HTMLDivElement>(null);

  // Scroll highlighted option into view
  useEffect(() => {
    if (isHighlighted && optionRef.current) {
      optionRef.current.scrollIntoView({ block: 'nearest' });
    }
  }, [isHighlighted]);

  return (
    <div
      ref={optionRef}
      role="option"
      aria-selected={isAlreadySelected}
      tabIndex={-1}
      className={`flex items-center gap-2 px-3 py-2 cursor-pointer transition-colors duration-75 ${
        isHighlighted
          ? 'bg-accent/10 text-accent'
          : isAlreadySelected
          ? 'bg-panel-soft text-muted line-through'
          : 'hover:bg-panel-soft'
      }`}
      onMouseEnter={onHighlight}
      onClick={onSelect}
    >
      {/* Avatar for user-type suggestions */}
      {suggestion.type === 'user' && suggestion.avatarUrl && (
        <img
          src={suggestion.avatarUrl}
          alt=""
          className="w-6 h-6 rounded-full flex-shrink-0"
          loading="lazy"
        />
      )}

      {/* Type indicator dot */}
      {suggestion.type && suggestion.type !== 'user' && (
        <span
          className={`w-2 h-2 rounded-full flex-shrink-0 ${
            suggestion.type === 'label'
              ? 'bg-green-500'
              : suggestion.type === 'category'
              ? 'bg-purple-500'
              : 'bg-accent'
          }`}
          aria-hidden="true"
        />
      )}

      {/* Label */}
      <span className="flex-1 truncate text-sm">{suggestion.label}</span>

      {/* Category badge */}
      {suggestion.category && (
        <span className="text-xs px-1.5 py-0.5 rounded bg-panel text-muted">
          {suggestion.category}
        </span>
      )}

      {/* Selected indicator */}
      {isAlreadySelected ? (
        <svg
          className="w-4 h-4 text-muted flex-shrink-0"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M3 8L6.5 11.5L13 4.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : isHighlighted ? (
        <kbd className="text-xs px-1.5 py-0.5 rounded bg-panel font-mono flex-shrink-0">
          Enter
        </kbd>
      ) : null}
    </div>
  );
}
