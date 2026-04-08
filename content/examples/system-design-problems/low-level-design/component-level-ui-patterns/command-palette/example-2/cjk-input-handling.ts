/**
 * Command Palette — Edge Case: CJK Input During Search.
 *
 * When typing in CJK (Chinese/Japanese/Korean), composition events fire
 * multiple times before the final character is committed. The palette
 * must not filter results during composition — only after the final
 * character is committed.
 */

import { useState, useCallback, useRef } from 'react';

export function useCJKCommandPalette<T extends { id: string; label: string }>(
  items: T[],
  filterFn: (query: string, items: T[]) => T[],
) {
  const [isComposing, setIsComposing] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<T[]>(items);

  const handleCompositionStart = useCallback(() => {
    setIsComposing(true);
  }, []);

  const handleCompositionEnd = useCallback((e: CompositionEvent) => {
    setIsComposing(false);
    // Filter now that composition is complete
    const filtered = filterFn(e.data, items);
    setResults(filtered.slice(0, 10));
  }, [items, filterFn]);

  const handleInputChange = useCallback((value: string) => {
    setQuery(value);
    if (!isComposing) {
      const filtered = filterFn(value, items);
      setResults(filtered.slice(0, 10));
    }
  }, [isComposing, items, filterFn]);

  return {
    query,
    results,
    isComposing,
    handleCompositionStart,
    handleCompositionEnd,
    handleInputChange,
  };
}
