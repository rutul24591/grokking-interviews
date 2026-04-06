'use client';

import React, { useRef, useEffect } from 'react';
import { TagPill } from './tag-pill';
import { SuggestionDropdown } from './suggestion-dropdown';
import { InputField } from './input-field';
import { useMultiSelect } from '../hooks/use-multi-select';
import { useSuggestions } from '../hooks/use-suggestions';
import type { Tag, Suggestion, MultiSelectConfig } from '../lib/multi-select-types';

interface MultiSelectProps<T = Record<string, unknown>> {
  config?: Partial<MultiSelectConfig<T>>;
  fetcher: (query: string, signal: AbortSignal) => Promise<Suggestion<T>[]>;
  onChange?: (tags: Tag<T>[]) => void;
  className?: string;
}

export function MultiSelect<T = Record<string, unknown>>({
  config,
  fetcher,
  onChange,
  className = '',
}: MultiSelectProps<T>) {
  const { state, actions, inputRef, handlers } = useMultiSelect<T>({
    fetcher,
    onChange,
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const { groups, isLoading, error, totalCount, retry } = useSuggestions<T>({
    query: state.inputValue,
    fetcher,
    selectedTags: state.selected,
    groupBy: state.config.groupBy,
    namespace: state.config.namespace,
  });

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        actions.toggleDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [actions]);

  const isAtMax =
    state.config.maxSelections !== undefined &&
    state.config.maxSelections !== Infinity &&
    state.selected.length >= state.config.maxSelections;

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Selected Tags */}
      <div className="flex flex-wrap gap-2 p-2 rounded-lg border border-theme bg-panel min-h-[44px]">
        {state.selected.map((tag) => (
          <TagPill
            key={tag.id}
            tag={tag}
            onRemove={() => handlers.onTagRemove(tag.id)}
          />
        ))}
        <InputField
          ref={inputRef}
          value={state.inputValue}
          onChange={handlers.onInputChange}
          onKeyDown={handlers.onKeyDown}
          onPaste={handlers.onPaste}
          placeholder={isAtMax ? `Maximum ${state.config.maxSelections} selections reached` : state.config.placeholder}
          disabled={isAtMax || state.config.disabled}
        />
      </div>

      {/* Max selection warning */}
      {isAtMax && (
        <div className="mt-1 text-xs text-warning" role="status" aria-live="polite">
          Maximum {state.config.maxSelections} selections reached. Remove a tag to add more.
        </div>
      )}

      {/* Suggestion Dropdown */}
      {state.isOpen && (
        <SuggestionDropdown
          groups={groups}
          isLoading={isLoading}
          error={error}
          highlightedIndex={state.highlightedIndex}
          onHighlight={actions.setHighlight}
          onSelect={(tag) => handlers.onTagAdd(tag)}
          onRetry={retry}
          allowCreate={state.config.allowCreate}
          inputValue={state.inputValue}
          totalCount={totalCount}
        />
      )}

      {/* Live region for screen readers */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {state.selected.length} tag{state.selected.length !== 1 ? 's' : ''} selected
      </div>
    </div>
  );
}
