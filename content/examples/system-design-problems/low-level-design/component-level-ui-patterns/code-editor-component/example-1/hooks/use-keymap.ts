import { useState, useCallback, useRef, useEffect } from 'react';
import type { EditorConfig } from '../lib/editor-types';

export function useKeymap(config: EditorConfig) {
  const [isFocused, setIsFocused] = useState(false);

  const onKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!isFocused) return;
    if (e.key === 'Tab') {
      e.preventDefault();
      // Insert tab characters
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'z') { e.preventDefault(); /* undo */ }
    if ((e.ctrlKey || e.metaKey) && e.key === 'y') { e.preventDefault(); /* redo */ }
    if ((e.ctrlKey || e.metaKey) && e.key === 'f') { e.preventDefault(); /* find */ }
  }, [isFocused]);

  return { isFocused, setIsFocused, onKeyDown };
}
