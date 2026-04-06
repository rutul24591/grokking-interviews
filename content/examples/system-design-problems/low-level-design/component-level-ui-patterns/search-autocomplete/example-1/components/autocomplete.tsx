'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useAutocomplete } from '../lib/use-autocomplete';
import { highlightText } from '../lib/highlight';
import type { Suggestion, AutocompleteProps } from '../lib/autocomplete-types';

// ─── Highlight Component ───────────────────────────────────────────────────

interface HighlightProps {
  text: string;
  query: string;
  highlightClassName?: string;
}

function AutocompleteHighlight({
  text,
  query,
  highlightClassName = 'font-bold text-accent',
}: HighlightProps) {
  const segments = highlightText(text, query);

  return (
    <>
      {segments.map((segment, i) =>
        segment.isMatch ? (
          <span key={i} className={highlightClassName}>
            {segment.text}
          </span>
        ) : (
          <span key={i}>{segment.text}</span>
        )
      )}
    </>
  );
}

// ─── Individual Option Component ───────────────────────────────────────────

interface AutocompleteOptionProps<T> {
  suggestion: Suggestion<T>;
  query: string;
  isHighlighted: boolean;
  onSelect: (suggestion: Suggestion<T>) => void;
  onHighlight: (index: number) => void;
  index: number;
}

function AutocompleteOption<T>({
  suggestion,
  query,
  isHighlighted,
  onSelect,
  onHighlight,
  index,
}: AutocompleteOptionProps<T>) {
  const optionId = `autocomplete-option-${index}`;

  const handleClick = () => {
    onSelect(suggestion);
  };

  const handleMouseEnter = () => {
    onHighlight(index);
  };

  return (
    <li
      id={optionId}
      role="option"
      aria-selected={isHighlighted}
      className={`
        px-4 py-2.5 cursor-pointer flex flex-col gap-0.5
        transition-colors duration-100
        ${isHighlighted ? 'bg-accent/10 text-accent' : 'hover:bg-panel-soft/50'}
      `}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
    >
      <span className="text-sm leading-relaxed">
        <AutocompleteHighlight text={suggestion.title} query={query} />
      </span>
      {suggestion.subtitle && (
        <span className="text-xs opacity-60 truncate">{suggestion.subtitle}</span>
      )}
    </li>
  );
}

// ─── Dropdown Component ────────────────────────────────────────────────────

interface AutocompleteDropdownProps<T> {
  suggestions: Suggestion<T>[];
  query: string;
  highlightedIndex: number;
  state: 'idle' | 'loading' | 'success' | 'error';
  onSelect: (suggestion: Suggestion<T>) => void;
  onHighlight: (index: number) => void;
  maxVisible: number;
}

function AutocompleteDropdown<T>({
  suggestions,
  query,
  highlightedIndex,
  state,
  onSelect,
  onHighlight,
  maxVisible,
}: AutocompleteDropdownProps<T>) {
  const dropdownRef = useRef<HTMLUListElement>(null);

  // Scroll highlighted item into view
  useEffect(() => {
    if (highlightedIndex >= 0 && dropdownRef.current) {
      const activeOption = dropdownRef.current.children[highlightedIndex] as HTMLElement;
      if (activeOption) {
        activeOption.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex]);

  // Don't render if idle with no suggestions
  if (state === 'idle' && suggestions.length === 0) return null;

  return (
    <ul
      ref={dropdownRef}
      role="listbox"
      className="absolute z-50 w-full mt-1 bg-panel border border-theme rounded-lg shadow-lg overflow-y-auto"
      style={{ maxHeight: `${maxVisible * 48}px` }}
    >
      {state === 'loading' && (
        <li className="px-4 py-3 text-sm text-muted flex items-center gap-2">
          <svg
            className="animate-spin h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          Searching...
        </li>
      )}

      {state === 'success' && suggestions.length === 0 && (
        <li className="px-4 py-3 text-sm text-muted">No results found</li>
      )}

      {state === 'error' && (
        <li className="px-4 py-3 text-sm text-red-400">Failed to load suggestions</li>
      )}

      {suggestions.map((suggestion, index) => (
        <AutocompleteOption
          key={suggestion.id}
          suggestion={suggestion}
          query={query}
          isHighlighted={index === highlightedIndex}
          onSelect={onSelect}
          onHighlight={onHighlight}
          index={index}
        />
      ))}

      {/* aria-live region for screen reader announcements */}
      <li className="sr-only" aria-live="polite">
        {state === 'success' && `${suggestions.length} results available`}
      </li>
    </ul>
  );
}

// ─── Main Autocomplete Component ────────────────────────────────────────────

export function Autocomplete<T extends Record<string, unknown>>({
  fetchSuggestions,
  onSelect,
  debounceMs = 300,
  maxVisible = 10,
  cacheSize = 100,
  minQueryLength = 2,
  placeholder = 'Search...',
  className = '',
}: AutocompleteProps<T>) {
  // Local input state (separate from suggestions state for performance)
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const blurTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const {
    state,
    query,
    suggestions,
    highlightedIndex,
    isDropdownOpen,
    error,
    onQueryChange,
    onKeyDown,
    onSelect: handleSelect,
    onHighlight,
    closeDropdown,
  } = useAutocomplete<T>({
    fetchSuggestions,
    onSelect,
    debounceMs,
    cacheSize,
    minQueryLength,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    onQueryChange(value);
  };

  const handleFocus = () => {
    // Clear any pending blur timeout
    if (blurTimeoutRef.current !== null) {
      clearTimeout(blurTimeoutRef.current);
      blurTimeoutRef.current = null;
    }
  };

  const handleBlur = () => {
    // Delay closing to allow suggestion click
    blurTimeoutRef.current = setTimeout(() => {
      closeDropdown();
    }, 150);
  };

  const handleSelectWithInputUpdate = useCallback(
    (suggestion: Suggestion<T>) => {
      setInputValue(suggestion.title);
      handleSelect(suggestion);
    },
    [handleSelect]
  );

  // Cleanup blur timeout on unmount
  useEffect(() => {
    return () => {
      if (blurTimeoutRef.current !== null) {
        clearTimeout(blurTimeoutRef.current);
      }
    };
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        closeDropdown();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [closeDropdown]);

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <div role="combobox" aria-expanded={isDropdownOpen} className="relative">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          aria-autocomplete="list"
          aria-controls="autocomplete-listbox"
          aria-activedescendant={
            highlightedIndex >= 0 ? `autocomplete-option-${highlightedIndex}` : undefined
          }
          className="w-full px-4 py-2.5 bg-input-bg border border-theme rounded-lg text-sm
            focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent
            placeholder:text-muted/50 transition-all duration-150"
        />
      </div>

      {isDropdownOpen && (
        <div id="autocomplete-listbox">
          <AutocompleteDropdown
            suggestions={suggestions}
            query={inputValue}
            highlightedIndex={highlightedIndex}
            state={state}
            onSelect={handleSelectWithInputUpdate}
            onHighlight={onHighlight}
            maxVisible={maxVisible}
          />
        </div>
      )}

      {error && state === 'error' && (
        <p className="mt-2 text-xs text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

// ─── Default Export ─────────────────────────────────────────────────────────

export default Autocomplete;
