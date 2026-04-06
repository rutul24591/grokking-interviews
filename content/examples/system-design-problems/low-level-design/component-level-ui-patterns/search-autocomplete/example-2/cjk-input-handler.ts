/**
 * CJK Input Handler — Handles composition events for Chinese/Japanese/Korean input.
 *
 * Interview edge case: IME (Input Method Editor) fires multiple compositionupdate events
 * before the final character is committed. If we trigger search on every compositionupdate,
 * we make excessive API calls with incomplete characters. Solution: only search on
 * compositionend.
 */

import { useRef, useCallback, useEffect, useState } from 'react';

interface UseCJKInputConfig {
  onQueryChange: (query: string) => void;
  debounceMs?: number;
}

/**
 * Hook that gatess search triggers during IME composition.
 * - Normal input: search on every keystroke (debounced)
 * - IME composition: pause search until compositionend
 */
export function useCJKInput({ onQueryChange, debounceMs = 300 }: UseCJKInputConfig) {
  const [isComposing, setIsComposing] = useState(false);
  const pendingQueryRef = useRef<string>('');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  /**
   * Check if the browser supports event.isComposing (modern browsers).
   * Fallback: check if composition events are supported.
   */
  const supportsComposingDetection = typeof CompositionEvent !== 'undefined';

  const scheduleSearch = useCallback((query: string) => {
    pendingQueryRef.current = query;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      if (!isComposing) {
        onQueryChange(pendingQueryRef.current);
      }
    }, debounceMs);
  }, [isComposing, debounceMs, onQueryChange]);

  const onCompositionStart = useCallback(() => {
    setIsComposing(true);
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const onCompositionEnd = useCallback((e: CompositionEvent) => {
    setIsComposing(false);
    // Search with the final composed text
    pendingQueryRef.current = (e.target as HTMLInputElement).value;
    onQueryChange(pendingQueryRef.current);
  }, [onQueryChange]);

  const onInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (isComposing) return; // Don't search during composition
    scheduleSearch(e.target.value);
  }, [isComposing, scheduleSearch]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return { inputRef, isComposing, onCompositionStart, onCompositionEnd, onInputChange };
}
