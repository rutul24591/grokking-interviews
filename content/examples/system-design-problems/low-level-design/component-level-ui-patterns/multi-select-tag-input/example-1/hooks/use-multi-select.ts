import { useCallback, useEffect, useRef } from 'react';
import { useMultiSelectStore } from '../lib/multi-select-store';
import { getGlobalCache } from '../lib/tag-cache';
import type { Tag, Suggestion } from '../lib/multi-select-types';

interface UseMultiSelectOptions<T> {
  fetcher: (query: string, signal: AbortSignal) => Promise<Suggestion<T>[]>;
  onChange?: (tags: Tag<T>[]) => void;
}

export function useMultiSelect<T = Record<string, unknown>>(
  options: UseMultiSelectOptions<T>
) {
  const store = useMultiSelectStore();
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const cache = getGlobalCache<T>({ namespace: store.getState().state.config.namespace });
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { state, actions } = store;
  const { debounceMs, allowCreate, delimiter } = state.config;

  const fetchSuggestions = useCallback(
    async (query: string) => {
      if (!query.trim()) {
        actions.setLoading(false);
        return;
      }

      // Check cache first
      const cached = cache.get(query);
      if (cached) {
        actions.setLoading(false);
        return cached;
      }

      // Cancel in-flight request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;
      actions.setLoading(true);

      try {
        const results = await options.fetcher(query, controller.signal);
        cache.set(query, results);
        actions.setLoading(false);
        return results;
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return null;
        }
        actions.setLoading(false);
        throw error;
      }
    },
    [cache, actions, options.fetcher]
  );

  const handleInputChange = useCallback(
    (value: string) => {
      actions.setInputValue(value);

      // Clear existing debounce timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Set new debounce timer
      debounceTimerRef.current = setTimeout(() => {
        fetchSuggestions(value);
      }, debounceMs);
    },
    [actions, debounceMs, fetchSuggestions]
  );

  const handleTagAdd = useCallback(
    (tag: Tag<T>) => {
      const added = actions.addTag(tag);
      if (added) {
        actions.clearInput();
        if (inputRef.current) {
          inputRef.current.focus();
        }
        options.onChange?.(store.getState().state.selected);
      }
      return added;
    },
    [actions, options.onChange, store]
  );

  const handleTagRemove = useCallback(
    (id: string) => {
      actions.removeTag(id);
      if (inputRef.current) {
        inputRef.current.focus();
      }
      options.onChange?.(store.getState().state.selected);
    },
    [actions, options.onChange, store]
  );

  const handlePaste = useCallback(
    (event: React.ClipboardEvent<HTMLInputElement>) => {
      const text = event.clipboardData.getData('text');
      const segments = text.split(delimiter ?? /[,;\t]/);
      const trimmed = segments.map((s) => s.trim()).filter(Boolean);

      if (trimmed.length <= 1) return; // Single item — let normal flow handle it

      event.preventDefault();
      let addedCount = 0;
      for (const segment of trimmed) {
        const tag: Tag<T> = {
          id: `custom-${Date.now()}-${addedCount}`,
          label: segment,
        };
        if (actions.addTag(tag)) {
          addedCount++;
        }
      }
      actions.clearInput();
      if (addedCount > 0) {
        options.onChange?.(store.getState().state.selected);
      }
    },
    [actions, delimiter, options.onChange, store]
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      const { highlightedIndex, isOpen, inputValue, selected } = state;
      const maxIndex = state.config.maxSelections
        ? Math.min(state.config.maxSelections - selected.length - 1, 0)
        : 0;

      switch (event.key) {
        case 'ArrowDown':
          if (isOpen) {
            event.preventDefault();
            actions.setHighlight(Math.min(highlightedIndex + 1, 20));
          }
          break;

        case 'ArrowUp':
          if (isOpen) {
            event.preventDefault();
            actions.setHighlight(Math.max(highlightedIndex - 1, -1));
          }
          break;

        case 'Enter':
          event.preventDefault();
          if (highlightedIndex >= 0) {
            // Select highlighted option (handled by SuggestionOption onClick)
          } else if (allowCreate && inputValue.trim()) {
            // Create new tag from input
            const tag: Tag<T> = {
              id: `custom-${Date.now()}`,
              label: inputValue.trim(),
            };
            handleTagAdd(tag);
          }
          break;

        case 'Escape':
          event.preventDefault();
          actions.toggleDropdown(false);
          actions.clearInput();
          break;

        case 'Backspace':
          if (inputValue === '' && selected.length > 0) {
            event.preventDefault();
            const lastTag = selected[selected.length - 1];
            handleTagRemove(lastTag.id);
          }
          break;

        case 'Tab':
          if (isOpen && highlightedIndex >= 0) {
            event.preventDefault();
            // Select highlighted and move focus
          }
          break;
      }
    },
    [state, actions, allowCreate, handleTagAdd, handleTagRemove]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    state,
    actions,
    inputRef,
    handlers: {
      onInputChange: handleInputChange,
      onTagAdd: handleTagAdd,
      onTagRemove: handleTagRemove,
      onKeyDown: handleKeyDown,
      onPaste: handlePaste,
    },
  };
}
