/**
 * Code Editor — Edge Case: IME Composition During Editing.
 *
 * When using an Input Method Editor (IME) for CJK input, composition events
 * fire multiple times before the final character is committed. The editor
 * must not trigger syntax highlighting or autocomplete during composition.
 */

import { useRef, useCallback, useState } from 'react';

export function useIMEComposition(
  onCommit: (text: string) => void,
) {
  const [isComposing, setIsComposing] = useState(false);
  const compositionTextRef = useRef('');
  const pendingChangeRef = useRef(false);

  const onCompositionStart = useCallback(() => {
    setIsComposing(true);
    compositionTextRef.current = '';
  }, []);

  const onCompositionUpdate = useCallback((e: CompositionEvent) => {
    compositionTextRef.current = e.data;
  }, []);

  const onCompositionEnd = useCallback((e: CompositionEvent) => {
    setIsComposing(false);
    const text = e.data;

    if (pendingChangeRef.current) {
      // Flush the pending change now that composition is complete
      pendingChangeRef.current = false;
      onCommit(text);
    }
  }, [onCommit]);

  /**
   * Call this from the editor's onChange handler.
   * Returns true if the change should be processed immediately,
   * false if it should be deferred until composition ends.
   */
  const onChange = useCallback((text: string): boolean => {
    if (isComposing) {
      pendingChangeRef.current = true;
      return false; // Defer
    }
    return true; // Process immediately
  }, [isComposing]);

  return {
    isComposing,
    onCompositionStart,
    onCompositionUpdate,
    onCompositionEnd,
    onChange,
  };
}
