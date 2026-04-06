import { useCallback, useEffect, useState } from 'react';
import { useTreeStore } from '../lib/tree-store';
import { filterTree, getHighlightSegments } from '../lib/tree-utils';

/**
 * Hook for tree search/filter.
 * Provides debounced search input, filter computation, and highlight extraction.
 */
export function useTreeSearch(debounceMs = 300) {
  const [inputValue, setInputValue] = useState('');
  const nodes = useTreeStore((state) => state.nodes);
  const rootIds = useTreeStore((state) => state.rootIds);
  const setSearch = useTreeStore((state) => state.setSearch);

  // Debounced search execution
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(inputValue);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [inputValue, debounceMs, setSearch]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  }, []);

  const handleClear = useCallback(() => {
    setInputValue('');
    setSearch('');
  }, [setSearch]);

  // Compute visible IDs based on current search
  const visibleIds = filterTree(nodes, rootIds, inputValue);

  // Get highlight segments for a given node name
  const getSegments = useCallback(
    (name: string) => {
      return getHighlightSegments(name, inputValue);
    },
    [inputValue]
  );

  return {
    inputValue,
    handleInputChange,
    handleClear,
    visibleIds,
    getSegments,
    hasActiveSearch: inputValue.trim().length > 0,
  };
}
